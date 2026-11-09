import { Link } from "react-router";
import { Clock } from "lucide-react";
import { waitingSummary } from "./p11";

export function WaitingReminder({ count, to }: { count: number; to?: string }) {
  if (count === 0) return null;
  const [number, ...rest] = waitingSummary(count).split(" ");
  return (
    <section className="waiting-reminder" aria-label="Przypomnienie o czekających zgłoszeniach">
      <Clock aria-hidden="true" className="waiting-reminder-icon" />
      <p>
        <strong>{number}</strong> {rest.join(" ")}
      </p>
      {to && (
        <Link className="waiting-reminder-link" to={to}>
          Pokaż je
        </Link>
      )}
    </section>
  );
}
