import type { ToastItem } from '../lib/types';

type Props = {
  items: ToastItem[];
  onDismiss: (id: string) => void;
};

export function ToastStack({ items, onDismiss }: Props) {
  return (
    <div className="toast-stack" aria-live="polite">
      {items.map((item) => (
        <div className={`toast ${item.status}`} key={item.id}>
          <div>
            <strong>{item.title}</strong>
            <p>{item.message}</p>
          </div>
          <button aria-label="Close notification" onClick={() => onDismiss(item.id)}>×</button>
        </div>
      ))}
    </div>
  );
}
