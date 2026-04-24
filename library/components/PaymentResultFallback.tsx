import { FileText } from "lucide-react";

export function PaymentResultFallback() {
  return (
    <div className="bg-gradient-to-br from-background via-background to-muted/20 py-8 md:py-16">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center animate-pulse">
                  <FileText className="w-16 h-16 text-gray-400" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  Loading Payment Result...
                </h1>
                <p className="text-xl text-muted-foreground">
                  Please wait while we process your payment information
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
