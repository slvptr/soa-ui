import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudyGroup } from '../../domain/study-group';
import { TuiMarkerIconModule } from '@taiga-ui/kit';
import { TuiSvgModule } from '@taiga-ui/core';

@Component({
  selector: 'soa-group-list-item',
  standalone: true,
  imports: [CommonModule, TuiMarkerIconModule, TuiSvgModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './group-list-item.component.html',
  styleUrls: ['./group-list-item.component.less'],
})
export class GroupListItemComponent {
  @Input()
  studyGroup: StudyGroup | null = null;
}
