import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Repository, EntityNotFoundError, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from 'src/common/exception/service.exception';
import { Receipt } from './entities/receipt.entity';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { CreateReceiptDto } from './dto/create-receipt.dto';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(Receipt)
    private readonly receiptRepository: Repository<Receipt>,
    private readonly entityManager: EntityManager,
  ) {}

  async find(user: User) {
    try {
      const result = await this.receiptRepository.find({
        where: { adder: { id: user.id } },
      });

      return result;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw EntityNotFoundException();
      } else {
        throw error;
      }
    }
  }

  async create(user: User, createReceiptDto: CreateReceiptDto) {
    try {
      const newReceipt = this.receiptRepository.create({
        date: createReceiptDto.date,
        title: createReceiptDto.title,
        category: createReceiptDto.category,
        rating: createReceiptDto.rating,
        adder: user,
        updater: user,
      });
      this.receiptRepository.save(newReceipt);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw EntityNotFoundException();
      } else {
        throw error;
      }
    }
  }

  async update(user: User, id: number, updateReceiptDtos: UpdateReceiptDto) {
    try {
      const existing = await this.receiptRepository.findOne({
        where: { id: id, adder: { id: user.id } },
      });
      if (!existing) throw new EntityNotFoundError(Receipt, id);

      existing.title = updateReceiptDtos.title;
      existing.date = updateReceiptDtos.date;
      existing.category = updateReceiptDtos.category;
      existing.rating = updateReceiptDtos.rating;
      existing.updater = user;

      this.receiptRepository.save(existing);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw EntityNotFoundException();
      } else {
        throw error;
      }
    }
  }

  async delete(user: User, id: number) {
    try {
      const existing = await this.receiptRepository.findOne({
        where: { id: id, adder: { id: user.id } },
      });
      if (!existing) throw new EntityNotFoundError(Receipt, id);
      this.receiptRepository.remove(existing);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw EntityNotFoundException();
      } else {
        throw error;
      }
    }
  }

  async bulkUpdate(user: User, updateReceiptDtos: UpdateReceiptDto[]) {
    try {
      await this.entityManager.transaction(async (manager) => {
        for (const dto of updateReceiptDtos) {
          if (dto.action === 'CREATE') {
            const newReceipt = manager.create(Receipt, {
              date: dto.date,
              title: dto.title,
              category: dto.category,
              rating: dto.rating,
              adder: user,
              updater: user,
            });
            await manager.save(newReceipt);
          } else if (dto.action === 'UPDATE') {
            const existing = await manager.findOne(Receipt, {
              where: { id: dto.id, adder: { id: user.id } },
            });
            if (!existing) throw new EntityNotFoundError(Receipt, dto.id);

            existing.title = dto.title;
            existing.date = dto.date;
            existing.category = dto.category;
            existing.rating = dto.rating;
            existing.updater = user;

            await manager.save(existing);
          } else if (dto.action === 'DELETE') {
            const existing = await manager.findOne(Receipt, {
              where: { id: dto.id, adder: { id: user.id } },
            });
            if (!existing) throw new EntityNotFoundError(Receipt, dto.id);
            await manager.remove(existing);
          }
        }
      });

      return await this.find(user);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw EntityNotFoundException();
      } else {
        throw error;
      }
    }
  }
}
