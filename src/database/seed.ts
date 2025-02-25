import { statusService } from '../services';
import { Color, Status } from '../types';
import { logger } from '../utils';

export async function createStatusIfNotExists() {
  try {
    const statusCount = await statusService.getStatusCount();

    if (!statusCount) {
      const defaultStatuses: { name: Status; color: Color }[] = [
        { name: 'IN_PROGRESS', color: '#007bff' },
        { name: 'DONE', color: '#28a745' },
        { name: 'ARCHIVED', color: '#6c757d' },
      ];

      await statusService.createMany(defaultStatuses);

      logger.info('Default statuses created successfully ✅');
    }
  } catch (error) {
    logger.error(`Error creating default statuses ❌ - ${error}`);
  }
}
