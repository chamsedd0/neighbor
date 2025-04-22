import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow, format, differenceInDays, addDays } from "date-fns"
import React from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | number): string {
  const dateObj = new Date(date)
  return format(dateObj, "MMM d, yyyy")
}

export function formatDateTime(date: Date | string | number): string {
  const dateObj = new Date(date)
  return format(dateObj, "MMM d, yyyy h:mm a")
}

export function formatRelativeDate(date: Date | string | number): string {
  const dateObj = new Date(date)
  const now = new Date()
  const diffInDays = Math.abs(differenceInDays(dateObj, now))

  if (diffInDays <= 7) {
    return formatDistanceToNow(dateObj, { addSuffix: true })
  } else {
    return format(dateObj, "MMM d, yyyy")
  }
}

export function calculateTotalPrice(
  startDate: Date, 
  endDate: Date, 
  pricePerUnit: number, 
  priceUnit: 'day' | 'week' | 'month'
): number {
  const days = differenceInDays(endDate, startDate)
  
  if (priceUnit === 'day') {
    return pricePerUnit * days
  } else if (priceUnit === 'week') {
    return pricePerUnit * (days / 7)
  } else if (priceUnit === 'month') {
    return pricePerUnit * (days / 30)
  }
  
  return 0
}

export function getUnavailableDates(
  bookedDates: { start: Date; end: Date }[]
): Date[] {
  const unavailableDates: Date[] = []
  
  bookedDates.forEach(booking => {
    let currentDate = new Date(booking.start)
    const endDate = new Date(booking.end)
    
    while (currentDate <= endDate) {
      unavailableDates.push(new Date(currentDate))
      currentDate = addDays(currentDate, 1)
    }
  })
  
  return unavailableDates
}

export function getLocationString(
  location: { 
    address?: string; 
    city: string; 
    state: string; 
    country: string; 
    zipCode?: string;
  }
): string {
  return `${location.city}, ${location.state}, ${location.country}`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function createImageUrl(file: File): string {
  return URL.createObjectURL(file)
}

// ShadCN theme colors
export const themeColors = {
  primary: '#22A424',
  secondary: '#4CC057',
  tertiary: '#98D992',
  fourth: '#B6EBB9',
  fifth: '#C5DEC5',
  sixth: '#E3F2DA',
  neutralWhite: '#FFFFFF',
  neutralBeige: '#D1D1D1',
  neutralGray: '#767676',
  neutralBlack: '#252525',
  accent: '#698DE0',
}

// Helper to safely get params in a way that works in both client and server components
// and handles the transition to the new React.use() approach in Next.js
export function getParamValue<T>(param: T | Promise<T>): T {
  // For development, simply return the param directly to avoid React.use issues
  if (process.env.NODE_ENV === 'development') {
    return param as T;
  }
  
  // In production, properly handle Promise params
  if (param instanceof Promise) {
    try {
      // @ts-ignore - TypeScript doesn't recognize React.use in some versions
      return React.use(param);
    } catch (e) {
      // Fallback if React.use is not available or fails
      console.warn('React.use failed, falling back to direct access');
      return param as unknown as T;
    }
  }
  
  // Direct access for the current behavior
  return param;
}
