import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

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
  productName?: string;
  metadata?: any;
  isRefunded: boolean;
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

export default function AdminPaymentsSimple() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  
  useEffect(() => {
    fetchTransactions();
  }, []);
  
  async function fetchTransactions() {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/payment-transactions');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Set the transactions data
      setTransactions(data);
      
      toast({
        title: "Transactions Loaded",
        description: `Successfully loaded ${data.length} transactions`,
        variant: "default"
      });
    } catch (error) {
      console.error("Error loading transactions:", error);
      
      toast({
        title: "Error Loading Transactions",
        description: "There was a problem loading the payment transactions",
        variant: "destructive"
      });
      
      // Set empty transactions array
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Payment Transactions</h1>
          <p className="text-sm text-gray-500">
            View payment transactions and revenue details
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => fetchTransactions()}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                Loading...
              </>
            ) : "Refresh Transactions"}
          </Button>
          
          <Button
            variant="outline"
            asChild
          >
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Complete transaction records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="rounded-md border">
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
                  {transactions.length > 0 ? (
                    transactions
                      .sort((a, b) => {
                        try {
                          return new Date(b.created).getTime() - new Date(a.created).getTime();
                        } catch (e) {
                          return 0;
                        }
                      })
                      .map((transaction, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {formatDate(transaction.created)}
                          </TableCell>
                          <TableCell>
                            {transaction.customerEmail || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {transaction.productType === 'individual'
                                ? 'Individual Assessment'
                                : transaction.productType === 'couple'
                                ? 'Couple Assessment'
                                : transaction.productType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            ${(transaction.amount / 100).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={transaction.status === 'succeeded' ? 'default' : 'outline'}>
                              {transaction.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}