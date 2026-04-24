import { X, Mail } from "lucide-react";
import { Button } from "@/library/ui/button";

type PayByEmailModalProps = {
  open: boolean;
  onClose: () => void;
  email?: string;
};

export function PayByEmailModal({ open, onClose, email }: PayByEmailModalProps) {
  if (!open) return null;

  const contactEmail = email?.trim() ?? "";
  const hasEmail = Boolean(contactEmail);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-blue-600">
            <Mail className="h-8 w-8 text-white" />
          </div>

          <h3 className="mb-4 text-2xl font-bold text-gray-900">
            Contact Us for Recharge
          </h3>

          <p className="mb-6 leading-relaxed text-gray-600">
            If you would like to use our products, please contact us via email
            for recharge.
          </p>

          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <p className="mb-2 text-sm text-gray-500">Contact Email:</p>
            <p className="text-lg font-semibold text-primary">
              {hasEmail ? contactEmail : "Email not configured"}
            </p>
          </div>

          <p className="mb-6 text-sm text-gray-600">
            After receiving your email, we will provide you with a recharge
            link.
          </p>

          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Close
            </Button>
            <Button
              onClick={() => {
                if (!hasEmail) return;
                window.location.href = `mailto:${contactEmail}?subject=Recharge Inquiry&body=Hello, I would like to know more about recharge options.`;
                onClose();
              }}
              className="flex-1 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
              disabled={!hasEmail}
            >
              Send Email
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
