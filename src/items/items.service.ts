import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput): Promise<Item> {
    const item = this.itemRepository.create(createItemInput);
    await this.itemRepository.save(item);

    return item;
  }

  async findAll(): Promise<Item[]> {
    const items = await this.itemRepository.find();
    return items;
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    await this.itemRepository.update(id, updateItemInput);
    const item = await this.findOne(id);

    return item;
  }

  async remove(id: string): Promise<Item> {
    const item = await this.findOne(id);
    await this.itemRepository.remove(item);

    return { ...item, id };
  }
}
