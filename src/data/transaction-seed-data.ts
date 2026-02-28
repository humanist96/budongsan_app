import type { Transaction } from '@/types'

export const transactions: Transaction[] = [
  // ── prop-001 한남더힐 (233㎡) ──────────────────────────
  { id: 'tx-001-01', property_id: 'prop-001', transaction_amount: 320000, transaction_year: 2017, transaction_month: 3, transaction_day: 15, exclusive_area: 233.71, floor: 3, raw_data: null, created_at: '2017-01-01' },
  { id: 'tx-001-02', property_id: 'prop-001', transaction_amount: 350000, transaction_year: 2018, transaction_month: 5, transaction_day: 22, exclusive_area: 233.71, floor: 5, raw_data: null, created_at: '2018-01-01' },
  { id: 'tx-001-03', property_id: 'prop-001', transaction_amount: 450000, transaction_year: 2019, transaction_month: 8, transaction_day: 10, exclusive_area: 233.71, floor: 7, raw_data: null, created_at: '2019-01-01' },
  { id: 'tx-001-04', property_id: 'prop-001', transaction_amount: 550000, transaction_year: 2020, transaction_month: 6, transaction_day: 5, exclusive_area: 233.71, floor: 4, raw_data: null, created_at: '2020-01-01' },
  { id: 'tx-001-05', property_id: 'prop-001', transaction_amount: 680000, transaction_year: 2021, transaction_month: 3, transaction_day: 18, exclusive_area: 233.71, floor: 8, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-001-06', property_id: 'prop-001', transaction_amount: 750000, transaction_year: 2021, transaction_month: 11, transaction_day: 25, exclusive_area: 233.71, floor: 6, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-001-07', property_id: 'prop-001', transaction_amount: 820000, transaction_year: 2022, transaction_month: 4, transaction_day: 12, exclusive_area: 233.71, floor: 10, raw_data: null, created_at: '2022-01-01' },
  { id: 'tx-001-08', property_id: 'prop-001', transaction_amount: 900000, transaction_year: 2023, transaction_month: 7, transaction_day: 8, exclusive_area: 233.71, floor: 9, raw_data: null, created_at: '2023-01-01' },

  // ── prop-007 나인원한남 ─────────────────────────────────
  { id: 'tx-007-01', property_id: 'prop-007', transaction_amount: 590000, transaction_year: 2020, transaction_month: 2, transaction_day: 14, exclusive_area: 206.57, floor: 5, raw_data: null, created_at: '2020-01-01' },
  { id: 'tx-007-02', property_id: 'prop-007', transaction_amount: 680000, transaction_year: 2020, transaction_month: 9, transaction_day: 3, exclusive_area: 206.57, floor: 8, raw_data: null, created_at: '2020-01-01' },
  { id: 'tx-007-03', property_id: 'prop-007', transaction_amount: 780000, transaction_year: 2021, transaction_month: 5, transaction_day: 20, exclusive_area: 206.57, floor: 12, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-007-04', property_id: 'prop-007', transaction_amount: 850000, transaction_year: 2022, transaction_month: 1, transaction_day: 11, exclusive_area: 206.57, floor: 7, raw_data: null, created_at: '2022-01-01' },
  { id: 'tx-007-05', property_id: 'prop-007', transaction_amount: 820000, transaction_year: 2023, transaction_month: 4, transaction_day: 17, exclusive_area: 206.57, floor: 3, raw_data: null, created_at: '2023-01-01' },
  { id: 'tx-007-06', property_id: 'prop-007', transaction_amount: 950000, transaction_year: 2024, transaction_month: 2, transaction_day: 28, exclusive_area: 206.57, floor: 10, raw_data: null, created_at: '2024-01-01' },

  // ── prop-016 PH129 청담 ─────────────────────────────────
  { id: 'tx-016-01', property_id: 'prop-016', transaction_amount: 800000, transaction_year: 2020, transaction_month: 6, transaction_day: 10, exclusive_area: 273.47, floor: 4, raw_data: null, created_at: '2020-01-01' },
  { id: 'tx-016-02', property_id: 'prop-016', transaction_amount: 1000000, transaction_year: 2021, transaction_month: 1, transaction_day: 22, exclusive_area: 273.47, floor: 7, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-016-03', property_id: 'prop-016', transaction_amount: 1200000, transaction_year: 2021, transaction_month: 9, transaction_day: 5, exclusive_area: 273.47, floor: 10, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-016-04', property_id: 'prop-016', transaction_amount: 1350000, transaction_year: 2022, transaction_month: 5, transaction_day: 15, exclusive_area: 273.47, floor: 8, raw_data: null, created_at: '2022-01-01' },
  { id: 'tx-016-05', property_id: 'prop-016', transaction_amount: 1500000, transaction_year: 2023, transaction_month: 3, transaction_day: 20, exclusive_area: 273.47, floor: 12, raw_data: null, created_at: '2023-01-01' },
  { id: 'tx-016-06', property_id: 'prop-016', transaction_amount: 1640000, transaction_year: 2024, transaction_month: 1, transaction_day: 8, exclusive_area: 273.47, floor: 6, raw_data: null, created_at: '2024-01-01' },

  // ── prop-021 아이파크삼성 ───────────────────────────────
  { id: 'tx-021-01', property_id: 'prop-021', transaction_amount: 280000, transaction_year: 2017, transaction_month: 7, transaction_day: 12, exclusive_area: 163.05, floor: 15, raw_data: null, created_at: '2017-01-01' },
  { id: 'tx-021-02', property_id: 'prop-021', transaction_amount: 310000, transaction_year: 2018, transaction_month: 4, transaction_day: 9, exclusive_area: 163.05, floor: 20, raw_data: null, created_at: '2018-01-01' },
  { id: 'tx-021-03', property_id: 'prop-021', transaction_amount: 350000, transaction_year: 2019, transaction_month: 6, transaction_day: 25, exclusive_area: 163.05, floor: 12, raw_data: null, created_at: '2019-01-01' },
  { id: 'tx-021-04', property_id: 'prop-021', transaction_amount: 380000, transaction_year: 2020, transaction_month: 1, transaction_day: 18, exclusive_area: 163.05, floor: 18, raw_data: null, created_at: '2020-01-01' },
  { id: 'tx-021-05', property_id: 'prop-021', transaction_amount: 420000, transaction_year: 2020, transaction_month: 11, transaction_day: 7, exclusive_area: 163.05, floor: 25, raw_data: null, created_at: '2020-01-01' },
  { id: 'tx-021-06', property_id: 'prop-021', transaction_amount: 480000, transaction_year: 2021, transaction_month: 8, transaction_day: 14, exclusive_area: 163.05, floor: 22, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-021-07', property_id: 'prop-021', transaction_amount: 500000, transaction_year: 2022, transaction_month: 3, transaction_day: 30, exclusive_area: 163.05, floor: 16, raw_data: null, created_at: '2022-01-01' },
  { id: 'tx-021-08', property_id: 'prop-021', transaction_amount: 550000, transaction_year: 2023, transaction_month: 10, transaction_day: 5, exclusive_area: 163.05, floor: 28, raw_data: null, created_at: '2023-01-01' },

  // ── prop-025 아크로리버파크 ─────────────────────────────
  { id: 'tx-025-01', property_id: 'prop-025', transaction_amount: 300000, transaction_year: 2017, transaction_month: 5, transaction_day: 20, exclusive_area: 129.97, floor: 10, raw_data: null, created_at: '2017-01-01' },
  { id: 'tx-025-02', property_id: 'prop-025', transaction_amount: 340000, transaction_year: 2018, transaction_month: 2, transaction_day: 8, exclusive_area: 129.97, floor: 14, raw_data: null, created_at: '2018-01-01' },
  { id: 'tx-025-03', property_id: 'prop-025', transaction_amount: 380000, transaction_year: 2019, transaction_month: 4, transaction_day: 15, exclusive_area: 129.97, floor: 8, raw_data: null, created_at: '2019-01-01' },
  { id: 'tx-025-04', property_id: 'prop-025', transaction_amount: 420000, transaction_year: 2020, transaction_month: 7, transaction_day: 22, exclusive_area: 129.97, floor: 18, raw_data: null, created_at: '2020-01-01' },
  { id: 'tx-025-05', property_id: 'prop-025', transaction_amount: 470000, transaction_year: 2021, transaction_month: 1, transaction_day: 10, exclusive_area: 129.97, floor: 12, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-025-06', property_id: 'prop-025', transaction_amount: 520000, transaction_year: 2021, transaction_month: 10, transaction_day: 28, exclusive_area: 129.97, floor: 20, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-025-07', property_id: 'prop-025', transaction_amount: 540000, transaction_year: 2022, transaction_month: 6, transaction_day: 14, exclusive_area: 129.97, floor: 15, raw_data: null, created_at: '2022-01-01' },
  { id: 'tx-025-08', property_id: 'prop-025', transaction_amount: 600000, transaction_year: 2024, transaction_month: 3, transaction_day: 5, exclusive_area: 129.97, floor: 22, raw_data: null, created_at: '2024-01-01' },

  // ── prop-026 반포자이 ──────────────────────────────────
  { id: 'tx-026-01', property_id: 'prop-026', transaction_amount: 200000, transaction_year: 2017, transaction_month: 4, transaction_day: 11, exclusive_area: 132.91, floor: 8, raw_data: null, created_at: '2017-01-01' },
  { id: 'tx-026-02', property_id: 'prop-026', transaction_amount: 230000, transaction_year: 2018, transaction_month: 1, transaction_day: 25, exclusive_area: 132.91, floor: 12, raw_data: null, created_at: '2018-01-01' },
  { id: 'tx-026-03', property_id: 'prop-026', transaction_amount: 270000, transaction_year: 2019, transaction_month: 6, transaction_day: 18, exclusive_area: 132.91, floor: 5, raw_data: null, created_at: '2019-01-01' },
  { id: 'tx-026-04', property_id: 'prop-026', transaction_amount: 310000, transaction_year: 2020, transaction_month: 3, transaction_day: 7, exclusive_area: 132.91, floor: 15, raw_data: null, created_at: '2020-01-01' },
  { id: 'tx-026-05', property_id: 'prop-026', transaction_amount: 350000, transaction_year: 2020, transaction_month: 12, transaction_day: 20, exclusive_area: 132.91, floor: 10, raw_data: null, created_at: '2020-01-01' },
  { id: 'tx-026-06', property_id: 'prop-026', transaction_amount: 390000, transaction_year: 2021, transaction_month: 7, transaction_day: 14, exclusive_area: 132.91, floor: 18, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-026-07', property_id: 'prop-026', transaction_amount: 410000, transaction_year: 2022, transaction_month: 5, transaction_day: 3, exclusive_area: 132.91, floor: 7, raw_data: null, created_at: '2022-01-01' },
  { id: 'tx-026-08', property_id: 'prop-026', transaction_amount: 450000, transaction_year: 2023, transaction_month: 9, transaction_day: 22, exclusive_area: 132.91, floor: 20, raw_data: null, created_at: '2023-01-01' },

  // ── prop-035 타워팰리스 ────────────────────────────────
  { id: 'tx-035-01', property_id: 'prop-035', transaction_amount: 200000, transaction_year: 2017, transaction_month: 2, transaction_day: 14, exclusive_area: 223.68, floor: 35, raw_data: null, created_at: '2017-01-01' },
  { id: 'tx-035-02', property_id: 'prop-035', transaction_amount: 230000, transaction_year: 2018, transaction_month: 6, transaction_day: 8, exclusive_area: 223.68, floor: 42, raw_data: null, created_at: '2018-01-01' },
  { id: 'tx-035-03', property_id: 'prop-035', transaction_amount: 280000, transaction_year: 2019, transaction_month: 9, transaction_day: 20, exclusive_area: 223.68, floor: 50, raw_data: null, created_at: '2019-01-01' },
  { id: 'tx-035-04', property_id: 'prop-035', transaction_amount: 320000, transaction_year: 2020, transaction_month: 5, transaction_day: 15, exclusive_area: 223.68, floor: 38, raw_data: null, created_at: '2020-01-01' },
  { id: 'tx-035-05', property_id: 'prop-035', transaction_amount: 370000, transaction_year: 2021, transaction_month: 2, transaction_day: 28, exclusive_area: 223.68, floor: 45, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-035-06', property_id: 'prop-035', transaction_amount: 420000, transaction_year: 2021, transaction_month: 11, transaction_day: 10, exclusive_area: 223.68, floor: 55, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-035-07', property_id: 'prop-035', transaction_amount: 440000, transaction_year: 2022, transaction_month: 8, transaction_day: 5, exclusive_area: 223.68, floor: 40, raw_data: null, created_at: '2022-01-01' },
  { id: 'tx-035-08', property_id: 'prop-035', transaction_amount: 500000, transaction_year: 2024, transaction_month: 1, transaction_day: 15, exclusive_area: 223.68, floor: 48, raw_data: null, created_at: '2024-01-01' },

  // ── prop-037 갤러리아포레 ──────────────────────────────
  { id: 'tx-037-01', property_id: 'prop-037', transaction_amount: 150000, transaction_year: 2017, transaction_month: 8, transaction_day: 5, exclusive_area: 178.46, floor: 6, raw_data: null, created_at: '2017-01-01' },
  { id: 'tx-037-02', property_id: 'prop-037', transaction_amount: 180000, transaction_year: 2018, transaction_month: 3, transaction_day: 18, exclusive_area: 178.46, floor: 10, raw_data: null, created_at: '2018-01-01' },
  { id: 'tx-037-03', property_id: 'prop-037', transaction_amount: 220000, transaction_year: 2019, transaction_month: 5, transaction_day: 22, exclusive_area: 178.46, floor: 8, raw_data: null, created_at: '2019-01-01' },
  { id: 'tx-037-04', property_id: 'prop-037', transaction_amount: 280000, transaction_year: 2020, transaction_month: 4, transaction_day: 10, exclusive_area: 178.46, floor: 12, raw_data: null, created_at: '2020-01-01' },
  { id: 'tx-037-05', property_id: 'prop-037', transaction_amount: 350000, transaction_year: 2021, transaction_month: 1, transaction_day: 28, exclusive_area: 178.46, floor: 15, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-037-06', property_id: 'prop-037', transaction_amount: 400000, transaction_year: 2021, transaction_month: 9, transaction_day: 14, exclusive_area: 178.46, floor: 7, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-037-07', property_id: 'prop-037', transaction_amount: 430000, transaction_year: 2022, transaction_month: 7, transaction_day: 20, exclusive_area: 178.46, floor: 11, raw_data: null, created_at: '2022-01-01' },
  { id: 'tx-037-08', property_id: 'prop-037', transaction_amount: 500000, transaction_year: 2023, transaction_month: 12, transaction_day: 3, exclusive_area: 178.46, floor: 14, raw_data: null, created_at: '2023-01-01' },

  // ── prop-074 에테르노 청담 ─────────────────────────────
  { id: 'tx-074-01', property_id: 'prop-074', transaction_amount: 1000000, transaction_year: 2023, transaction_month: 6, transaction_day: 15, exclusive_area: 296.12, floor: 5, raw_data: null, created_at: '2023-01-01' },
  { id: 'tx-074-02', property_id: 'prop-074', transaction_amount: 1350000, transaction_year: 2023, transaction_month: 11, transaction_day: 20, exclusive_area: 296.12, floor: 8, raw_data: null, created_at: '2023-01-01' },
  { id: 'tx-074-03', property_id: 'prop-074', transaction_amount: 1700000, transaction_year: 2024, transaction_month: 3, transaction_day: 10, exclusive_area: 296.12, floor: 10, raw_data: null, created_at: '2024-01-01' },
  { id: 'tx-074-04', property_id: 'prop-074', transaction_amount: 2000000, transaction_year: 2024, transaction_month: 8, transaction_day: 5, exclusive_area: 296.12, floor: 12, raw_data: null, created_at: '2024-01-01' },

  // ── prop-028 래미안원베일리 ─────────────────────────────
  { id: 'tx-028-01', property_id: 'prop-028', transaction_amount: 350000, transaction_year: 2021, transaction_month: 10, transaction_day: 8, exclusive_area: 114.73, floor: 15, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-028-02', property_id: 'prop-028', transaction_amount: 400000, transaction_year: 2022, transaction_month: 2, transaction_day: 18, exclusive_area: 114.73, floor: 22, raw_data: null, created_at: '2022-01-01' },
  { id: 'tx-028-03', property_id: 'prop-028', transaction_amount: 420000, transaction_year: 2022, transaction_month: 8, transaction_day: 25, exclusive_area: 114.73, floor: 18, raw_data: null, created_at: '2022-01-01' },
  { id: 'tx-028-04', property_id: 'prop-028', transaction_amount: 450000, transaction_year: 2023, transaction_month: 3, transaction_day: 12, exclusive_area: 114.73, floor: 25, raw_data: null, created_at: '2023-01-01' },
  { id: 'tx-028-05', property_id: 'prop-028', transaction_amount: 500000, transaction_year: 2023, transaction_month: 9, transaction_day: 30, exclusive_area: 114.73, floor: 20, raw_data: null, created_at: '2023-01-01' },
  { id: 'tx-028-06', property_id: 'prop-028', transaction_amount: 550000, transaction_year: 2024, transaction_month: 5, transaction_day: 15, exclusive_area: 114.73, floor: 28, raw_data: null, created_at: '2024-01-01' },
]
