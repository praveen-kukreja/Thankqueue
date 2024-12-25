
import ThankYouApproval from './approve-thanks';

export default function ThankYouList({ requests }: { requests: { helperId: number, helperName: string }[] }) {
    return (
      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.helperId} className="p-4 border rounded">
            <p>{request.helperName} helped you!</p>
            <ThankYouApproval helperId={request.helperId} />
          </div>
        ))}
      </div>
    );
  }
  