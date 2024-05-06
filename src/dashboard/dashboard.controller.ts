import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseMassage } from 'src/common/decorator/response.decorater';
import { DashboardService } from './dashboard.service';
import { DashboardDTO } from './DTO/dashboard.dto';
import { AdminGuard } from 'src/common/guard/admin.guard';
import { DASHBOARD_COUNT } from 'src/utils/constans/sucessMassage';

@ApiTags('Dashboard')
@Controller('/dashboard')
@ApiBearerAuth()
@UseGuards(AdminGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Post('/total-student')
  @ResponseMassage(DASHBOARD_COUNT)
  totalDashboard(@Body() dashboardDTO: DashboardDTO) {
    return this.dashboardService.totalStudentCount(dashboardDTO);
  }
}
