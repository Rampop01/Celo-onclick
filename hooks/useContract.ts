/**
 * React Hooks for OnClick Smart Contract Interactions
 */

'use client';

import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { ONCLICK_CONTRACT, Role, toUSDCAmount, fromUSDCAmount, Page, Payment, USDC_ADDRESS } from '../lib/contract';
import { useEffect, useState } from 'react';

/**
 * Hook to create a new page
 */
export function useCreatePage() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createPage = async (
    handle: string,
    role: Role,
    walletAddress: string,
    goal: number = 0,
    deadline: number = 0
  ) => {
    const goalAmount = goal > 0 ? toUSDCAmount(goal) : BigInt(0);
    const deadlineTimestamp = deadline > 0 ? BigInt(Math.floor(deadline / 1000)) : BigInt(0);

    writeContract({
      ...ONCLICK_CONTRACT,
      functionName: 'createPage',
      args: [handle, role, walletAddress, goalAmount, deadlineTimestamp],
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

  const makePayment = async (handle: string, amount: number, message: string = '') => {
    const amountInUSDC = toUSDCAmount(amount);

    writeContract({
      ...ONCLICK_CONTRACT,
      functionName: 'makePayment',
      args: [handle, amountInUSDC, message],
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

  const approveUSDC = async (amount: bigint) => {
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

  const updatePage = async (
    handle: string,
    walletAddress: string,
    goal: number = 0,
    deadline: number = 0
  ) => {
    const goalAmount = goal > 0 ? toUSDCAmount(goal) : BigInt(0);
    const deadlineTimestamp = deadline > 0 ? BigInt(Math.floor(deadline / 1000)) : BigInt(0);

    writeContract({
      ...ONCLICK_CONTRACT,
      functionName: 'updatePage',
      args: [handle, walletAddress, goalAmount, deadlineTimestamp],
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
      setStep('paying');
    }
  }, [approveSuccess]);

  useEffect(() => {
    if (paySuccess) {
      setStep('success');
    }
  }, [paySuccess]);

  useEffect(() => {
    if (approveError) {
      setStep('error');
      setErrorMessage(approveError.message || 'Approval failed');
    }
  }, [approveError]);

  useEffect(() => {
    if (payError) {
      setStep('error');
      setErrorMessage(payError.message || 'Payment failed');
    }
  }, [payError]);

  const startPayment = async (handle: string, amount: number, message: string = '') => {
    try {
      setStep('idle');
      setErrorMessage('');

      const amountInUSDC = toUSDCAmount(amount);

      // Check balance
      if (balance && balance < amountInUSDC) {
        setStep('error');
        setErrorMessage('Insufficient USDC balance');
        return;
      }

      // Check allowance
      await refetchAllowance();
      
      if (!allowance || allowance < amountInUSDC) {
        // Need to approve
        setStep('approving');
        await approveUSDC(amountInUSDC);
        // Wait for approval success (handled by useEffect)
      } else {
        // Already approved, proceed to payment
        setStep('paying');
        await makePayment(handle, amount, message);
      }
    } catch (error: any) {
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

