export interface Transaction {
  id: string
  property_id: string
  transaction_amount: number
  transaction_year: number
  transaction_month: number
  transaction_day: number
  exclusive_area: number | null
  floor: number | null
  raw_data: Record<string, unknown> | null
  created_at: string
}

export interface TransactionChartData {
  date: string
  price: number
  pricePerPyeong: number
  floor: number | null
}
