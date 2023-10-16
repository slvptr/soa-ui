import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'soa-study-group-list-skeleton',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './study-group-list-skeleton.component.html',
  styleUrls: ['./study-group-list-skeleton.component.less'],
})
export class StudyGroupListSkeletonComponent {
  readonly repetitions = new Array(10).fill(null);
}
