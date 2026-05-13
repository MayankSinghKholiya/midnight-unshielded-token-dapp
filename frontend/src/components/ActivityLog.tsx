import type { ActivityItem } from '../lib/types';
import { Card } from './Card';

type Props = {
  items: ActivityItem[];
};

export function ActivityLog({ items }: Props) {
  return (
    <Card eyebrow="Runtime" title="Operation log">
      <div className="activity-list">
        {items.map((item) => (
          <div className="activity-item" key={item.id}>
            <span className={`activity-badge ${item.status}`}>{item.status}</span>
            <div>
              <strong>{item.label}</strong>
              <p>{item.description}</p>
            </div>
            <time>{item.time}</time>
          </div>
        ))}
      </div>
    </Card>
  );
}
