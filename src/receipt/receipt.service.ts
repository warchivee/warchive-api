import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Repository, EntityNotFoundError, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from 'src/common/exception/service.exception';
import { Receipt } from './entities/receipt.entity';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { ReceiptSyncInfo } from './entities/receipt-sync-info.entity';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(Receipt)
    private readonly receiptRepository: Repository<Receipt>,
    @InjectRepository(ReceiptSyncInfo)
    private readonly receiptSyncInfoRepository: Repository<ReceiptSyncInfo>,
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

  async findSyncInfo(user: User) {
    try {
      const result = await this.receiptSyncInfoRepository.findOne({
        where: { user_id: user.id },
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

  async synchronize(user: User, createReceiptDtos: CreateReceiptDto[]) {
    try {
      const now = new Date();

      await this.entityManager.transaction(async (manager) => {
        // 1️⃣ 기존 유저 영수증 데이터 삭제
        await manager.delete(Receipt, { adder: { id: user.id } });

        // 2️⃣ 새로운 데이터 삽입
        for (const dto of createReceiptDtos) {
          const newReceipt = manager.create(Receipt, {
            date: dto.date,
            title: dto.title,
            category: dto.category,
            rating: dto.rating,
            adder: user,
            updater: user,
          });
          await manager.save(newReceipt);
        }

        // 3️⃣ 마지막 동기화 시간 업데이트
        const existingSync = await manager.findOne(ReceiptSyncInfo, {
          where: { user_id: user.id },
        });

        if (existingSync) {
          existingSync.last_synced_at = now;
          await manager.save(existingSync);
        } else {
          const newSyncInfo = manager.create(ReceiptSyncInfo, {
            user_id: user.id,
            lastSyncedAt: now,
          });
          await manager.save(newSyncInfo);
        }
      });

      // 4️⃣ 동기화 후 최신 데이터 반환
      return {
        last_synced_at: now,
        datas: await this.find(user),
      };
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw EntityNotFoundException();
      } else {
        throw error;
      }
    }
  }
}
