'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice, formatPyeong } from '@/lib/utils'
import { pricePerPyeong } from '@/lib/utils/pyeong'
import type { Transaction } from '@/types'

interface TransactionHistoryProps {
  transactions: Transaction[]
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  if (transactions.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">거래 이력</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left py-2 font-medium">거래일</th>
                <th className="text-right py-2 font-medium">거래가</th>
                <th className="text-right py-2 font-medium">평당가</th>
                <th className="text-right py-2 font-medium">면적</th>
                <th className="text-right py-2 font-medium">층</th>
              </tr>
            </thead>
            <tbody>
              {[...transactions].reverse().map((t) => (
                <tr key={t.id} className="border-b last:border-0">
                  <td className="py-2">
                    {t.transaction_year}.{String(t.transaction_month).padStart(2, '0')}.{String(t.transaction_day).padStart(2, '0')}
                  </td>
                  <td className="text-right py-2 font-medium">
                    {formatPrice(t.transaction_amount)}
                  </td>
                  <td className="text-right py-2 text-muted-foreground">
                    {t.exclusive_area
                      ? `${formatPrice(pricePerPyeong(t.transaction_amount, t.exclusive_area))}`
                      : '-'}
                  </td>
                  <td className="text-right py-2 text-muted-foreground">
                    {t.exclusive_area ? formatPyeong(t.exclusive_area) : '-'}
                  </td>
                  <td className="text-right py-2 text-muted-foreground">
                    {t.floor ? `${t.floor}층` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
