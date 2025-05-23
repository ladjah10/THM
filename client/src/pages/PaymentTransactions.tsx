import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { RefreshCw, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLocation } from "wouter";
// No need for the auth hook anymore

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

export default function PaymentTransactions() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  // Add admin constants
  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "100marriage";
  
  // Track authentication directly with local state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_authenticated') === 'true';
  });
  
  // Authentication states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Load transactions if already authenticated
    if (isAuthenticated) {
      loadTransactions();
    }
  }, [isAuthenticated]);

  // Handle login form submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Store authentication state in localStorage
      localStorage.setItem('admin_authenticated', 'true');
      setIsAuthenticated(true);
      
      toast({
        title: "Authentication successful",
        description: "Welcome to the payment transactions dashboard",
        variant: "default",
      });
      
      // Load transactions after successful login
      loadTransactions();
    } else {
      toast({
        title: "Authentication failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  // Load transactions from the server
  const loadTransactions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest("GET", "/api/admin/payment-transactions");
      
      if (!response.ok) {
        throw new Error("Failed to fetch payment transactions");
      }
      
      const data = await response.json();
      setTransactions(data);
      
      // Show success toast
      toast({
        title: "Data loaded",
        description: `Successfully loaded ${data.length} transactions`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error loading transactions:", error);
      setError("Failed to load payment transactions");
      
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to load payment transactions",
        variant: "destructive",
      });
      
      // Use test data for fallback
      setTransactions([
        {
          id: "1",
          stripeId: "pi_test123456",
          customerEmail: "test@example.com",
          amount: 4900,
          currency: "usd",
          status: "succeeded",
          created: new Date().toISOString(),
          productType: "individual",
          productName: "Individual Assessment",
          isRefunded: false
        },
        {
          id: "2",
          stripeId: "pi_test789012",
          customerEmail: "john@example.com",
          amount: 7900,
          currency: "usd",
          status: "succeeded",
          created: new Date(Date.now() - 86400000).toISOString(),
          productType: "couple",
          productName: "Couple Assessment",
          isRefunded: false
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Payment Transactions</CardTitle>
            <CardDescription>
              Login to view payment transaction data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  className="w-full rounded-md border border-input px-3 py-2"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full rounded-md border border-input px-3 py-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Payment Transactions</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => window.location.href = "/admin"}
              >
                Back to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.removeItem('admin_authenticated');
                  setIsAuthenticated(false);
                  setUsername("");
                  setPassword("");
                  
                  toast({
                    title: "Logged Out",
                    description: "You have been logged out",
                    variant: "default",
                  });
                }}
              >
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    Complete transaction records
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadTransactions}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Data
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 p-4 rounded-md mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error loading transactions</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
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
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}