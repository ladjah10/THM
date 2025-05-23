import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { RefreshCw, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Define PaymentTransaction interface
interface PaymentTransaction {
  id: string;
  stripeId: string;
  customerEmail?: string;
  amount: number;
  currency: string;
  status: string;
  created: string;
  productType: string;
  assessmentType?: string;
  productName?: string;
  metadata: string | Record<string, any>;
  isRefunded: boolean;
  refundAmount?: number;
  refundReason?: string;
  promoCode?: string;
  customerId?: string;
}

// Format date function
function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    return 'Invalid date';
  }
}

export default function SimpleAdminPayments() {
  const { toast } = useToast();
  const [transactionDateRange, setTransactionDateRange] = useState({
    start: '',
    end: ''
  });

  // Initialize paymentTransactions from localStorage if available
  const [cachedTransactions, setCachedTransactions] = useState<PaymentTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('admin_payment_transactions');
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Error loading cached transactions:", err);
      return [];
    }
  });
  
  const { data: paymentTransactions, isLoading: isLoadingPaymentTransactions } = useQuery<PaymentTransaction[]>({
    queryKey: ['/api/admin/payment-transactions', transactionDateRange],
    queryFn: async () => {
      let url = "/api/admin/payment-transactions";
      const params = new URLSearchParams();
      
      if (transactionDateRange.start) {
        params.append('startDate', transactionDateRange.start);
      }
      
      if (transactionDateRange.end) {
        params.append('endDate', transactionDateRange.end);
      }
      
      const queryString = params.toString();
      if (queryString) {
        url = `${url}?${queryString}`;
      }
      
      const response = await apiRequest("GET", url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch payment transactions");
      }
      
      const data = await response.json();
      
      // Save to localStorage when new data arrives
      try {
        localStorage.setItem('admin_payment_transactions', JSON.stringify(data));
        setCachedTransactions(data);
      } catch (err) {
        console.error("Error caching transactions:", err);
      }
      
      return data;
    },
    initialData: cachedTransactions.length > 0 ? cachedTransactions : undefined,
  });
  
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h2 className="text-lg font-medium">Payment Transactions</h2>
            <p className="text-sm text-gray-500">
              View revenue and payment details
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ['/api/admin/payment-transactions'] });
                toast({
                  title: "Refreshing Transactions",
                  description: "Fetching latest transaction data...",
                  variant: "default"
                });
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Transactions
            </Button>
          </div>
        </div>
        
        {isLoadingPaymentTransactions ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : !paymentTransactions ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 bg-red-50 rounded-lg">
            <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
            <h3 className="text-lg font-medium text-red-700">Error Loading Transactions</h3>
            <p className="text-sm text-center text-red-600 max-w-md">
              There was a problem loading payment transactions. Please try refreshing the page
              or contact support if the issue persists.
            </p>
            <Button 
              className="mt-4" 
              variant="outline" 
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ['/api/admin/payment-transactions'] })
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Loading Transactions
            </Button>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                Transaction records from the database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentTransactions && Array.isArray(paymentTransactions) && paymentTransactions.length > 0 ? (
                    paymentTransactions
                      .sort((a, b) => {
                        try {
                          return new Date(b.created).getTime() - new Date(a.created).getTime();
                        } catch (e) {
                          console.error("Error sorting transactions", e);
                          return 0;
                        }
                      })
                      .map((transaction, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {transaction.created ? formatDate(transaction.created) : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {transaction.customerEmail || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {transaction.productType === 'individual'
                                ? 'Individual'
                                : transaction.productType === 'couple'
                                ? 'Couple'
                                : transaction.productType || 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            ${(transaction.amount / 100).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={transaction.status === 'succeeded' ? 'default' : 'outline'}>
                              {transaction.status || 'Unknown'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No transactions found. Click "Refresh Transactions" to try again.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}