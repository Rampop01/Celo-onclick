/**
 * React Hooks for OnClick Smart Contract Interactions
 */

'use client';

import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt, useSwitchChain, useChainId } from 'wagmi';
import { ONCLICK_CONTRACT, Role, toUSDCAmount, fromUSDCAmount, Page, Payment, USDC_ADDRESS, CHAIN } from '../lib/contract';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

/**
 * Hook to create a new page
 */
export function useCreatePage() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();
  const { isConnected } = useAccount();

  const createPage = async (
    handle: string,
    role: Role,
    walletAddress: string,
    goal: number = 0,
    deadline: number = 0
  ) => {
    // Check if wallet is connected and on the correct chain
    if (isConnected && chainId !== CHAIN.id) {
      toast.error(`Please switch to ${CHAIN.name} to continue`);
      try {
        await switchChain({ chainId: CHAIN.id });
        // Wait a bit for chain switch
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (switchError: any) {
        toast.error(`Failed to switch chain: ${switchError.message}`);
        return;
      }
    }

    const goalAmount = goal > 0 ? toUSDCAmount(goal) : BigInt(0);
    const deadlineTimestamp = deadline > 0 ? BigInt(Math.floor(deadline / 1000)) : BigInt(0);

    writeContract({
      ...ONCLICK_CONTRACT,
      functionName: 'createPage',
      args: [handle, role, walletAddress, goalAmount, deadlineTimestamp],
      chainId: CHAIN.id,
    });
  };

  return {
    createPage,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to make a crypto payment
 */
export function useMakePayment() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();
  const { isConnected } = useAccount();

  const makePayment = async (handle: string, amount: number, message: string = '') => {
    // Check if wallet is connected and on the correct chain
    if (isConnected && chainId !== CHAIN.id) {
      toast.error(`Please switch to ${CHAIN.name} to continue`);
      try {
        await switchChain({ chainId: CHAIN.id });
        // Wait a bit for chain switch
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (switchError: any) {
        toast.error(`Failed to switch chain: ${switchError.message}`);
        return;
      }
    }

    const amountInUSDC = toUSDCAmount(amount);

    writeContract({
      ...ONCLICK_CONTRACT,
      functionName: 'makePayment',
      args: [handle, amountInUSDC, message],
      chainId: CHAIN.id,
    });
  };

  return {
    makePayment,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to approve USDC spending
 */
export function useApproveUSDC() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();
  const { isConnected } = useAccount();

  const approveUSDC = async (amount: bigint) => {
    // Check if wallet is connected and on the correct chain
    if (isConnected && chainId !== CHAIN.id) {
      toast.error(`Please switch to ${CHAIN.name} to continue`);
      try {
        await switchChain({ chainId: CHAIN.id });
        // Wait a bit for chain switch
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (switchError: any) {
        toast.error(`Failed to switch chain: ${switchError.message}`);
        return;
      }
    }

    writeContract({
      address: USDC_ADDRESS,
      abi: [
        {
          name: 'approve',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' },
          ],
          outputs: [{ name: '', type: 'bool' }],
        },
      ],
      functionName: 'approve',
      args: [ONCLICK_CONTRACT.address, amount],
      chainId: CHAIN.id,
    });
  };

  return {
    approveUSDC,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to check USDC allowance
 */
export function useUSDCAllowance() {
  const { address } = useAccount();

  const { data: allowance, isLoading, refetch } = useReadContract({
    address: USDC_ADDRESS,
    abi: [
      {
        name: 'allowance',
        type: 'function',
        stateMutability: 'view',
        inputs: [
          { name: 'owner', type: 'address' },
          { name: 'spender', type: 'address' },
        ],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ],
    functionName: 'allowance',
    args: address ? [address, ONCLICK_CONTRACT.address] : undefined,
    chainId: CHAIN.id, // Specify chain for contract calls
    query: {
      enabled: !!address,
    },
  });

  return {
    allowance: allowance as bigint | undefined,
    isLoading,
    refetch,
  };
}

/**
 * Hook to check USDC balance
 */
export function useUSDCBalance() {
  const { address } = useAccount();

  const { data: balance, isLoading, refetch } = useReadContract({
    address: USDC_ADDRESS,
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: CHAIN.id, // Specify chain for contract calls
    query: {
      enabled: !!address,
    },
  });

  return {
    balance: balance as bigint | undefined,
    balanceFormatted: balance ? fromUSDCAmount(balance as bigint) : 0,
    isLoading,
    refetch,
  };
}

/**
 * Hook to get page data
 */
export function useGetPage(handle: string | undefined) {
  const { data: page, isLoading, error, refetch } = useReadContract({
    ...ONCLICK_CONTRACT,
    functionName: 'getPage',
    args: handle ? [handle] : undefined,
    chainId: CHAIN.id,
    query: {
      enabled: !!handle,
    },
  });

  return {
    page: page as Page | undefined,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to check if handle is available
 */
export function useIsHandleAvailable(handle: string | undefined) {
  const { data: isAvailable, isLoading } = useReadContract({
    ...ONCLICK_CONTRACT,
    functionName: 'isHandleAvailable',
    args: handle ? [handle] : undefined,
    chainId: CHAIN.id,
    query: {
      enabled: !!handle && handle.length > 0,
    },
  });

  return {
    isAvailable: isAvailable as boolean | undefined,
    isLoading,
  };
}

/**
 * Hook to get payments for a page
 */
export function useGetPayments(handle: string | undefined) {
  const { data: payments, isLoading, refetch } = useReadContract({
    ...ONCLICK_CONTRACT,
    functionName: 'getPayments',
    args: handle ? [handle] : undefined,
    chainId: CHAIN.id,
    query: {
      enabled: !!handle,
    },
  });

  return {
    payments: payments as Payment[] | undefined,
    isLoading,
    refetch,
  };
}

/**
 * Hook to update page
 */
export function useUpdatePage() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();
  const { isConnected } = useAccount();

  const updatePage = async (
    handle: string,
    walletAddress: string,
    goal: number = 0,
    deadline: number = 0
  ) => {
    // Check if wallet is connected and on the correct chain
    if (isConnected && chainId !== CHAIN.id) {
      toast.error(`Please switch to ${CHAIN.name} to continue`);
      try {
        await switchChain({ chainId: CHAIN.id });
        // Wait a bit for chain switch
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (switchError: any) {
        toast.error(`Failed to switch chain: ${switchError.message}`);
        return;
      }
    }

    const goalAmount = goal > 0 ? toUSDCAmount(goal) : BigInt(0);
    const deadlineTimestamp = deadline > 0 ? BigInt(Math.floor(deadline / 1000)) : BigInt(0);

    writeContract({
      ...ONCLICK_CONTRACT,
      functionName: 'updatePage',
      args: [handle, walletAddress, goalAmount, deadlineTimestamp],
      chainId: CHAIN.id,
    });
  };

  return {
    updatePage,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to check if goal is reached
 */
export function useIsGoalReached(handle: string | undefined) {
  const { data: isReached, isLoading } = useReadContract({
    ...ONCLICK_CONTRACT,
    functionName: 'isGoalReached',
    args: handle ? [handle] : undefined,
    chainId: CHAIN.id,
    query: {
      enabled: !!handle,
    },
  });

  return {
    isReached: isReached as boolean | undefined,
    isLoading,
  };
}

/**
 * Combined hook for payment flow (approve + pay)
 */
export function usePaymentFlow() {
  const [step, setStep] = useState<'idle' | 'approving' | 'paying' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { approveUSDC, isPending: isApproving, isSuccess: approveSuccess, error: approveError } = useApproveUSDC();
  const { makePayment, isPending: isPaying, isSuccess: paySuccess, error: payError } = useMakePayment();
  const { allowance, refetch: refetchAllowance } = useUSDCAllowance();
  const { balance } = useUSDCBalance();

  useEffect(() => {
    if (approveSuccess) {
      console.log('[PaymentFlow] Approval succeeded, moving to paying step');
      setStep('paying');
    }
  }, [approveSuccess]);

  useEffect(() => {
    if (paySuccess) {
      console.log('[PaymentFlow] Payment succeeded, moving to success step');
      setStep('success');
    }
  }, [paySuccess]);

  useEffect(() => {
    if (approveError) {
      console.error('[PaymentFlow] Approval error:', approveError);
      setStep('error');
      setErrorMessage(approveError.message || 'Approval failed');
    }
  }, [approveError]);

  useEffect(() => {
    if (payError) {
      console.error('[PaymentFlow] Payment error:', payError);
      setStep('error');
      setErrorMessage(payError.message || 'Payment failed');
    }
  }, [payError]);

  const startPayment = async (handle: string, amount: number, message: string = '') => {
    try {
      setStep('idle');
      setErrorMessage('');
      console.log('[PaymentFlow] Starting payment', { handle, amount, message });

      const amountInUSDC = toUSDCAmount(amount);
      console.log('[PaymentFlow] Amount in USDC:', amountInUSDC.toString());

      // Check balance
      if (balance && balance < amountInUSDC) {
        console.warn('[PaymentFlow] Insufficient USDC balance:', balance.toString());
        setStep('error');
        setErrorMessage('Insufficient USDC balance');
        return;
      }

      // Check allowance
      await refetchAllowance();
      console.log('[PaymentFlow] Allowance:', allowance?.toString());
      
      if (!allowance || allowance < amountInUSDC) {
        // Need to approve
        console.log('[PaymentFlow] Allowance too low, approving USDC...');
        setStep('approving');
        await approveUSDC(amountInUSDC);
        // Wait for approval success (handled by useEffect)
      } else {
        // Already approved, proceed to payment
        console.log('[PaymentFlow] Allowance sufficient, making payment...');
        setStep('paying');
        await makePayment(handle, amount, message);
      }
    } catch (error: any) {
      console.error('[PaymentFlow] startPayment error:', error);
      setStep('error');
      setErrorMessage(error.message || 'Payment failed');
    }
  };

  const reset = () => {
    setStep('idle');
    setErrorMessage('');
  };

  return {
    startPayment,
    step,
    isApproving,
    isPaying,
    isSuccess: step === 'success',
    isError: step === 'error',
    errorMessage,
    reset,
  };
}

