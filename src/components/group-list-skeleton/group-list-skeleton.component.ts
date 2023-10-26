import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'soa-group-list-skeleton',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './group-list-skeleton.component.html',
  styleUrls: ['./group-list-skeleton.component.less'],
})
export class GroupListSkeletonComponent {
  readonly repetitions = new Array(10).fill(null);
}
