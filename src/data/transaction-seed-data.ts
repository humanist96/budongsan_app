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

  // ── prop-003 한남더힐 펜트하우스 (BTS 진) ─────────────────
  { id: 'tx-003-01', property_id: 'prop-003', transaction_amount: 680000, transaction_year: 2019, transaction_month: 3, transaction_day: 10, exclusive_area: 243.2, floor: 1, raw_data: null, created_at: '2019-01-01' },
  { id: 'tx-003-02', property_id: 'prop-003', transaction_amount: 850000, transaction_year: 2020, transaction_month: 7, transaction_day: 22, exclusive_area: 243.2, floor: 1, raw_data: null, created_at: '2020-01-01' },
  { id: 'tx-003-03', property_id: 'prop-003', transaction_amount: 1100000, transaction_year: 2021, transaction_month: 6, transaction_day: 15, exclusive_area: 243.2, floor: 1, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-003-04', property_id: 'prop-003', transaction_amount: 1350000, transaction_year: 2022, transaction_month: 4, transaction_day: 8, exclusive_area: 243.2, floor: 1, raw_data: null, created_at: '2022-01-01' },
  { id: 'tx-003-05', property_id: 'prop-003', transaction_amount: 1500000, transaction_year: 2023, transaction_month: 9, transaction_day: 20, exclusive_area: 243.2, floor: 1, raw_data: null, created_at: '2023-01-01' },
  { id: 'tx-003-06', property_id: 'prop-003', transaction_amount: 1750000, transaction_year: 2025, transaction_month: 5, transaction_day: 1, exclusive_area: 243.2, floor: 1, raw_data: null, created_at: '2025-01-01' },

  // ── prop-038 트리마제 성수 (BTS 정국, 황희찬) ──────────────
  { id: 'tx-038-01', property_id: 'prop-038', transaction_amount: 120000, transaction_year: 2018, transaction_month: 5, transaction_day: 12, exclusive_area: 140.3, floor: 10, raw_data: null, created_at: '2018-01-01' },
  { id: 'tx-038-02', property_id: 'prop-038', transaction_amount: 155000, transaction_year: 2019, transaction_month: 8, transaction_day: 20, exclusive_area: 140.3, floor: 15, raw_data: null, created_at: '2019-01-01' },
  { id: 'tx-038-03', property_id: 'prop-038', transaction_amount: 195000, transaction_year: 2020, transaction_month: 6, transaction_day: 8, exclusive_area: 140.3, floor: 12, raw_data: null, created_at: '2020-01-01' },
  { id: 'tx-038-04', property_id: 'prop-038', transaction_amount: 240000, transaction_year: 2021, transaction_month: 3, transaction_day: 15, exclusive_area: 140.3, floor: 18, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-038-05', property_id: 'prop-038', transaction_amount: 260000, transaction_year: 2022, transaction_month: 7, transaction_day: 22, exclusive_area: 140.3, floor: 8, raw_data: null, created_at: '2022-01-01' },
  { id: 'tx-038-06', property_id: 'prop-038', transaction_amount: 290000, transaction_year: 2024, transaction_month: 1, transaction_day: 10, exclusive_area: 140.3, floor: 20, raw_data: null, created_at: '2024-01-01' },

  // ── prop-065 한남리버힐 (BTS 슈가, 하정우, 박지성) ────────
  { id: 'tx-065-01', property_id: 'prop-065', transaction_amount: 180000, transaction_year: 2017, transaction_month: 4, transaction_day: 5, exclusive_area: 244.19, floor: 5, raw_data: null, created_at: '2017-01-01' },
  { id: 'tx-065-02', property_id: 'prop-065', transaction_amount: 220000, transaction_year: 2018, transaction_month: 8, transaction_day: 15, exclusive_area: 244.19, floor: 8, raw_data: null, created_at: '2018-01-01' },
  { id: 'tx-065-03', property_id: 'prop-065', transaction_amount: 280000, transaction_year: 2019, transaction_month: 11, transaction_day: 20, exclusive_area: 244.19, floor: 3, raw_data: null, created_at: '2019-01-01' },
  { id: 'tx-065-04', property_id: 'prop-065', transaction_amount: 340000, transaction_year: 2020, transaction_month: 9, transaction_day: 10, exclusive_area: 244.19, floor: 10, raw_data: null, created_at: '2020-01-01' },
  { id: 'tx-065-05', property_id: 'prop-065', transaction_amount: 400000, transaction_year: 2021, transaction_month: 5, transaction_day: 28, exclusive_area: 244.19, floor: 7, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-065-06', property_id: 'prop-065', transaction_amount: 450000, transaction_year: 2023, transaction_month: 6, transaction_day: 14, exclusive_area: 244.19, floor: 12, raw_data: null, created_at: '2023-01-01' },

  // ── prop-030 아크로비스타 (윤석열/김건희, 김태효) ──────────
  { id: 'tx-030-01', property_id: 'prop-030', transaction_amount: 120000, transaction_year: 2017, transaction_month: 3, transaction_day: 18, exclusive_area: 179.8, floor: 10, raw_data: null, created_at: '2017-01-01' },
  { id: 'tx-030-02', property_id: 'prop-030', transaction_amount: 145000, transaction_year: 2018, transaction_month: 7, transaction_day: 5, exclusive_area: 179.8, floor: 15, raw_data: null, created_at: '2018-01-01' },
  { id: 'tx-030-03', property_id: 'prop-030', transaction_amount: 175000, transaction_year: 2019, transaction_month: 10, transaction_day: 22, exclusive_area: 179.8, floor: 8, raw_data: null, created_at: '2019-01-01' },
  { id: 'tx-030-04', property_id: 'prop-030', transaction_amount: 210000, transaction_year: 2020, transaction_month: 12, transaction_day: 10, exclusive_area: 179.8, floor: 20, raw_data: null, created_at: '2020-01-01' },
  { id: 'tx-030-05', property_id: 'prop-030', transaction_amount: 250000, transaction_year: 2021, transaction_month: 8, transaction_day: 15, exclusive_area: 179.8, floor: 12, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-030-06', property_id: 'prop-030', transaction_amount: 270000, transaction_year: 2023, transaction_month: 5, transaction_day: 20, exclusive_area: 179.8, floor: 18, raw_data: null, created_at: '2023-01-01' },

  // ── prop-053 압구정 현대아파트 (유재석, 손흥민, 최지영) ────
  { id: 'tx-053-01', property_id: 'prop-053', transaction_amount: 150000, transaction_year: 2017, transaction_month: 5, transaction_day: 10, exclusive_area: 196.2, floor: 5, raw_data: null, created_at: '2017-01-01' },
  { id: 'tx-053-02', property_id: 'prop-053', transaction_amount: 195000, transaction_year: 2018, transaction_month: 9, transaction_day: 22, exclusive_area: 196.2, floor: 8, raw_data: null, created_at: '2018-01-01' },
  { id: 'tx-053-03', property_id: 'prop-053', transaction_amount: 240000, transaction_year: 2019, transaction_month: 11, transaction_day: 5, exclusive_area: 196.2, floor: 3, raw_data: null, created_at: '2019-01-01' },
  { id: 'tx-053-04', property_id: 'prop-053', transaction_amount: 280000, transaction_year: 2020, transaction_month: 8, transaction_day: 18, exclusive_area: 196.2, floor: 12, raw_data: null, created_at: '2020-01-01' },
  { id: 'tx-053-05', property_id: 'prop-053', transaction_amount: 320000, transaction_year: 2021, transaction_month: 4, transaction_day: 25, exclusive_area: 196.2, floor: 7, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-053-06', property_id: 'prop-053', transaction_amount: 350000, transaction_year: 2022, transaction_month: 10, transaction_day: 8, exclusive_area: 196.2, floor: 10, raw_data: null, created_at: '2022-01-01' },
  { id: 'tx-053-07', property_id: 'prop-053', transaction_amount: 380000, transaction_year: 2024, transaction_month: 3, transaction_day: 15, exclusive_area: 196.2, floor: 6, raw_data: null, created_at: '2024-01-01' },

  // ── prop-042 잠실엘스 (정진석) ────────────────────────────
  { id: 'tx-042-01', property_id: 'prop-042', transaction_amount: 110000, transaction_year: 2017, transaction_month: 6, transaction_day: 14, exclusive_area: 119.93, floor: 10, raw_data: null, created_at: '2017-01-01' },
  { id: 'tx-042-02', property_id: 'prop-042', transaction_amount: 135000, transaction_year: 2018, transaction_month: 10, transaction_day: 5, exclusive_area: 119.93, floor: 15, raw_data: null, created_at: '2018-01-01' },
  { id: 'tx-042-03', property_id: 'prop-042', transaction_amount: 165000, transaction_year: 2019, transaction_month: 9, transaction_day: 20, exclusive_area: 119.93, floor: 8, raw_data: null, created_at: '2019-01-01' },
  { id: 'tx-042-04', property_id: 'prop-042', transaction_amount: 195000, transaction_year: 2020, transaction_month: 7, transaction_day: 12, exclusive_area: 119.93, floor: 20, raw_data: null, created_at: '2020-01-01' },
  { id: 'tx-042-05', property_id: 'prop-042', transaction_amount: 230000, transaction_year: 2021, transaction_month: 5, transaction_day: 8, exclusive_area: 119.93, floor: 12, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-042-06', property_id: 'prop-042', transaction_amount: 250000, transaction_year: 2022, transaction_month: 11, transaction_day: 25, exclusive_area: 119.93, floor: 18, raw_data: null, created_at: '2022-01-01' },
  { id: 'tx-042-07', property_id: 'prop-042', transaction_amount: 260000, transaction_year: 2024, transaction_month: 2, transaction_day: 10, exclusive_area: 119.93, floor: 14, raw_data: null, created_at: '2024-01-01' },

  // ── prop-044 헬리오시티 (이재명) ──────────────────────────
  { id: 'tx-044-01', property_id: 'prop-044', transaction_amount: 105000, transaction_year: 2019, transaction_month: 4, transaction_day: 20, exclusive_area: 128.72, floor: 12, raw_data: null, created_at: '2019-01-01' },
  { id: 'tx-044-02', property_id: 'prop-044', transaction_amount: 135000, transaction_year: 2020, transaction_month: 2, transaction_day: 15, exclusive_area: 128.72, floor: 18, raw_data: null, created_at: '2020-01-01' },
  { id: 'tx-044-03', property_id: 'prop-044', transaction_amount: 170000, transaction_year: 2020, transaction_month: 12, transaction_day: 5, exclusive_area: 128.72, floor: 8, raw_data: null, created_at: '2020-01-01' },
  { id: 'tx-044-04', property_id: 'prop-044', transaction_amount: 195000, transaction_year: 2021, transaction_month: 7, transaction_day: 22, exclusive_area: 128.72, floor: 25, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-044-05', property_id: 'prop-044', transaction_amount: 180000, transaction_year: 2022, transaction_month: 9, transaction_day: 10, exclusive_area: 128.72, floor: 15, raw_data: null, created_at: '2022-01-01' },
  { id: 'tx-044-06', property_id: 'prop-044', transaction_amount: 200000, transaction_year: 2024, transaction_month: 4, transaction_day: 18, exclusive_area: 128.72, floor: 20, raw_data: null, created_at: '2024-01-01' },

  // ── prop-036 도곡렉슬 (김동연 배우자) ─────────────────────
  { id: 'tx-036-01', property_id: 'prop-036', transaction_amount: 110000, transaction_year: 2017, transaction_month: 7, transaction_day: 8, exclusive_area: 164.98, floor: 8, raw_data: null, created_at: '2017-01-01' },
  { id: 'tx-036-02', property_id: 'prop-036', transaction_amount: 135000, transaction_year: 2018, transaction_month: 11, transaction_day: 15, exclusive_area: 164.98, floor: 12, raw_data: null, created_at: '2018-01-01' },
  { id: 'tx-036-03', property_id: 'prop-036', transaction_amount: 165000, transaction_year: 2019, transaction_month: 10, transaction_day: 22, exclusive_area: 164.98, floor: 5, raw_data: null, created_at: '2019-01-01' },
  { id: 'tx-036-04', property_id: 'prop-036', transaction_amount: 200000, transaction_year: 2020, transaction_month: 9, transaction_day: 5, exclusive_area: 164.98, floor: 15, raw_data: null, created_at: '2020-01-01' },
  { id: 'tx-036-05', property_id: 'prop-036', transaction_amount: 240000, transaction_year: 2021, transaction_month: 6, transaction_day: 18, exclusive_area: 164.98, floor: 10, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-036-06', property_id: 'prop-036', transaction_amount: 260000, transaction_year: 2023, transaction_month: 8, transaction_day: 25, exclusive_area: 164.98, floor: 14, raw_data: null, created_at: '2023-01-01' },

  // ── prop-075 브라이튼N40 (유재석) ─────────────────────────
  { id: 'tx-075-01', property_id: 'prop-075', transaction_amount: 580000, transaction_year: 2022, transaction_month: 5, transaction_day: 12, exclusive_area: 199.0, floor: 35, raw_data: null, created_at: '2022-01-01' },
  { id: 'tx-075-02', property_id: 'prop-075', transaction_amount: 650000, transaction_year: 2023, transaction_month: 1, transaction_day: 20, exclusive_area: 199.0, floor: 38, raw_data: null, created_at: '2023-01-01' },
  { id: 'tx-075-03', property_id: 'prop-075', transaction_amount: 750000, transaction_year: 2023, transaction_month: 8, transaction_day: 8, exclusive_area: 199.0, floor: 40, raw_data: null, created_at: '2023-01-01' },
  { id: 'tx-075-04', property_id: 'prop-075', transaction_amount: 866000, transaction_year: 2024, transaction_month: 5, transaction_day: 15, exclusive_area: 199.0, floor: 42, raw_data: null, created_at: '2024-01-01' },

  // ── prop-069 아크로서울포레스트 PH (전지현) ────────────────
  { id: 'tx-069-01', property_id: 'prop-069', transaction_amount: 750000, transaction_year: 2020, transaction_month: 10, transaction_day: 5, exclusive_area: 264.0, floor: 45, raw_data: null, created_at: '2020-01-01' },
  { id: 'tx-069-02', property_id: 'prop-069', transaction_amount: 950000, transaction_year: 2021, transaction_month: 6, transaction_day: 18, exclusive_area: 264.0, floor: 47, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-069-03', property_id: 'prop-069', transaction_amount: 1100000, transaction_year: 2022, transaction_month: 3, transaction_day: 22, exclusive_area: 264.0, floor: 46, raw_data: null, created_at: '2022-01-01' },
  { id: 'tx-069-04', property_id: 'prop-069', transaction_amount: 1300000, transaction_year: 2022, transaction_month: 9, transaction_day: 10, exclusive_area: 264.0, floor: 47, raw_data: null, created_at: '2022-01-01' },
  { id: 'tx-069-05', property_id: 'prop-069', transaction_amount: 1450000, transaction_year: 2024, transaction_month: 4, transaction_day: 15, exclusive_area: 264.0, floor: 45, raw_data: null, created_at: '2024-01-01' },

  // ── prop-079 아페르한강 PH (BTS 제이홉) ────────────────────
  { id: 'tx-079-01', property_id: 'prop-079', transaction_amount: 900000, transaction_year: 2023, transaction_month: 9, transaction_day: 5, exclusive_area: 232.86, floor: 30, raw_data: null, created_at: '2023-01-01' },
  { id: 'tx-079-02', property_id: 'prop-079', transaction_amount: 1050000, transaction_year: 2024, transaction_month: 1, transaction_day: 18, exclusive_area: 232.86, floor: 32, raw_data: null, created_at: '2024-01-01' },
  { id: 'tx-079-03', property_id: 'prop-079', transaction_amount: 1200000, transaction_year: 2024, transaction_month: 6, transaction_day: 10, exclusive_area: 232.86, floor: 35, raw_data: null, created_at: '2024-01-01' },
  { id: 'tx-079-04', property_id: 'prop-079', transaction_amount: 1350000, transaction_year: 2025, transaction_month: 1, transaction_day: 22, exclusive_area: 232.86, floor: 28, raw_data: null, created_at: '2025-01-01' },

  // ── prop-081 메세나폴리스 PH (임영웅) ─────────────────────
  { id: 'tx-081-01', property_id: 'prop-081', transaction_amount: 280000, transaction_year: 2018, transaction_month: 4, transaction_day: 12, exclusive_area: 200.0, floor: 28, raw_data: null, created_at: '2018-01-01' },
  { id: 'tx-081-02', property_id: 'prop-081', transaction_amount: 350000, transaction_year: 2019, transaction_month: 10, transaction_day: 5, exclusive_area: 200.0, floor: 30, raw_data: null, created_at: '2019-01-01' },
  { id: 'tx-081-03', property_id: 'prop-081', transaction_amount: 420000, transaction_year: 2021, transaction_month: 3, transaction_day: 18, exclusive_area: 200.0, floor: 25, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-081-04', property_id: 'prop-081', transaction_amount: 510000, transaction_year: 2022, transaction_month: 9, transaction_day: 22, exclusive_area: 200.0, floor: 32, raw_data: null, created_at: '2022-01-01' },
  { id: 'tx-081-05', property_id: 'prop-081', transaction_amount: 550000, transaction_year: 2024, transaction_month: 5, transaction_day: 8, exclusive_area: 200.0, floor: 28, raw_data: null, created_at: '2024-01-01' },

  // ── prop-018 청담자이 (이강인) ────────────────────────────
  { id: 'tx-018-01', property_id: 'prop-018', transaction_amount: 180000, transaction_year: 2017, transaction_month: 3, transaction_day: 15, exclusive_area: 198.35, floor: 8, raw_data: null, created_at: '2017-01-01' },
  { id: 'tx-018-02', property_id: 'prop-018', transaction_amount: 210000, transaction_year: 2018, transaction_month: 8, transaction_day: 22, exclusive_area: 198.35, floor: 12, raw_data: null, created_at: '2018-01-01' },
  { id: 'tx-018-03', property_id: 'prop-018', transaction_amount: 260000, transaction_year: 2019, transaction_month: 12, transaction_day: 10, exclusive_area: 198.35, floor: 5, raw_data: null, created_at: '2019-01-01' },
  { id: 'tx-018-04', property_id: 'prop-018', transaction_amount: 310000, transaction_year: 2021, transaction_month: 2, transaction_day: 18, exclusive_area: 198.35, floor: 15, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-018-05', property_id: 'prop-018', transaction_amount: 350000, transaction_year: 2022, transaction_month: 6, transaction_day: 5, exclusive_area: 198.35, floor: 10, raw_data: null, created_at: '2022-01-01' },
  { id: 'tx-018-06', property_id: 'prop-018', transaction_amount: 380000, transaction_year: 2023, transaction_month: 10, transaction_day: 25, exclusive_area: 198.35, floor: 14, raw_data: null, created_at: '2023-01-01' },

  // ── prop-043 잠실리센츠 (김광현) ──────────────────────────
  { id: 'tx-043-01', property_id: 'prop-043', transaction_amount: 105000, transaction_year: 2017, transaction_month: 9, transaction_day: 8, exclusive_area: 125.58, floor: 10, raw_data: null, created_at: '2017-01-01' },
  { id: 'tx-043-02', property_id: 'prop-043', transaction_amount: 130000, transaction_year: 2018, transaction_month: 12, transaction_day: 15, exclusive_area: 125.58, floor: 15, raw_data: null, created_at: '2018-01-01' },
  { id: 'tx-043-03', property_id: 'prop-043', transaction_amount: 160000, transaction_year: 2019, transaction_month: 10, transaction_day: 22, exclusive_area: 125.58, floor: 8, raw_data: null, created_at: '2019-01-01' },
  { id: 'tx-043-04', property_id: 'prop-043', transaction_amount: 190000, transaction_year: 2020, transaction_month: 8, transaction_day: 5, exclusive_area: 125.58, floor: 20, raw_data: null, created_at: '2020-01-01' },
  { id: 'tx-043-05', property_id: 'prop-043', transaction_amount: 220000, transaction_year: 2021, transaction_month: 4, transaction_day: 18, exclusive_area: 125.58, floor: 12, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-043-06', property_id: 'prop-043', transaction_amount: 240000, transaction_year: 2023, transaction_month: 7, transaction_day: 12, exclusive_area: 125.58, floor: 18, raw_data: null, created_at: '2023-01-01' },

  // ── prop-027 래미안퍼스티지 (신동엽) ──────────────────────
  { id: 'tx-027-01', property_id: 'prop-027', transaction_amount: 180000, transaction_year: 2017, transaction_month: 2, transaction_day: 20, exclusive_area: 163.9, floor: 10, raw_data: null, created_at: '2017-01-01' },
  { id: 'tx-027-02', property_id: 'prop-027', transaction_amount: 215000, transaction_year: 2018, transaction_month: 6, transaction_day: 12, exclusive_area: 163.9, floor: 15, raw_data: null, created_at: '2018-01-01' },
  { id: 'tx-027-03', property_id: 'prop-027', transaction_amount: 260000, transaction_year: 2019, transaction_month: 9, transaction_day: 8, exclusive_area: 163.9, floor: 8, raw_data: null, created_at: '2019-01-01' },
  { id: 'tx-027-04', property_id: 'prop-027', transaction_amount: 310000, transaction_year: 2020, transaction_month: 11, transaction_day: 25, exclusive_area: 163.9, floor: 18, raw_data: null, created_at: '2020-01-01' },
  { id: 'tx-027-05', property_id: 'prop-027', transaction_amount: 370000, transaction_year: 2021, transaction_month: 7, transaction_day: 15, exclusive_area: 163.9, floor: 12, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-027-06', property_id: 'prop-027', transaction_amount: 400000, transaction_year: 2022, transaction_month: 4, transaction_day: 10, exclusive_area: 163.9, floor: 20, raw_data: null, created_at: '2022-01-01' },
  { id: 'tx-027-07', property_id: 'prop-027', transaction_amount: 430000, transaction_year: 2024, transaction_month: 1, transaction_day: 22, exclusive_area: 163.9, floor: 14, raw_data: null, created_at: '2024-01-01' },

  // ── prop-040 래미안대치팰리스 (이낙연, 윤희숙) ─────────────
  { id: 'tx-040-01', property_id: 'prop-040', transaction_amount: 200000, transaction_year: 2017, transaction_month: 8, transaction_day: 15, exclusive_area: 160.24, floor: 12, raw_data: null, created_at: '2017-01-01' },
  { id: 'tx-040-02', property_id: 'prop-040', transaction_amount: 250000, transaction_year: 2018, transaction_month: 11, transaction_day: 5, exclusive_area: 160.24, floor: 18, raw_data: null, created_at: '2018-01-01' },
  { id: 'tx-040-03', property_id: 'prop-040', transaction_amount: 310000, transaction_year: 2019, transaction_month: 12, transaction_day: 20, exclusive_area: 160.24, floor: 8, raw_data: null, created_at: '2019-01-01' },
  { id: 'tx-040-04', property_id: 'prop-040', transaction_amount: 360000, transaction_year: 2021, transaction_month: 3, transaction_day: 10, exclusive_area: 160.24, floor: 22, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-040-05', property_id: 'prop-040', transaction_amount: 380000, transaction_year: 2022, transaction_month: 8, transaction_day: 18, exclusive_area: 160.24, floor: 15, raw_data: null, created_at: '2022-01-01' },
  { id: 'tx-040-06', property_id: 'prop-040', transaction_amount: 420000, transaction_year: 2024, transaction_month: 5, transaction_day: 12, exclusive_area: 160.24, floor: 20, raw_data: null, created_at: '2024-01-01' },

  // ── prop-056 경희궁자이 (이낙연) ──────────────────────────
  { id: 'tx-056-01', property_id: 'prop-056', transaction_amount: 120000, transaction_year: 2018, transaction_month: 3, transaction_day: 10, exclusive_area: 163.55, floor: 8, raw_data: null, created_at: '2018-01-01' },
  { id: 'tx-056-02', property_id: 'prop-056', transaction_amount: 155000, transaction_year: 2019, transaction_month: 7, transaction_day: 22, exclusive_area: 163.55, floor: 12, raw_data: null, created_at: '2019-01-01' },
  { id: 'tx-056-03', property_id: 'prop-056', transaction_amount: 190000, transaction_year: 2020, transaction_month: 10, transaction_day: 5, exclusive_area: 163.55, floor: 5, raw_data: null, created_at: '2020-01-01' },
  { id: 'tx-056-04', property_id: 'prop-056', transaction_amount: 220000, transaction_year: 2021, transaction_month: 6, transaction_day: 18, exclusive_area: 163.55, floor: 15, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-056-05', property_id: 'prop-056', transaction_amount: 240000, transaction_year: 2023, transaction_month: 2, transaction_day: 28, exclusive_area: 163.55, floor: 10, raw_data: null, created_at: '2023-01-01' },

  // ── prop-051 마포래미안푸르지오 (박영선) ────────────────────
  { id: 'tx-051-01', property_id: 'prop-051', transaction_amount: 80000, transaction_year: 2017, transaction_month: 4, transaction_day: 18, exclusive_area: 149.47, floor: 10, raw_data: null, created_at: '2017-01-01' },
  { id: 'tx-051-02', property_id: 'prop-051', transaction_amount: 100000, transaction_year: 2018, transaction_month: 9, transaction_day: 10, exclusive_area: 149.47, floor: 15, raw_data: null, created_at: '2018-01-01' },
  { id: 'tx-051-03', property_id: 'prop-051', transaction_amount: 130000, transaction_year: 2019, transaction_month: 11, transaction_day: 22, exclusive_area: 149.47, floor: 8, raw_data: null, created_at: '2019-01-01' },
  { id: 'tx-051-04', property_id: 'prop-051', transaction_amount: 160000, transaction_year: 2020, transaction_month: 12, transaction_day: 5, exclusive_area: 149.47, floor: 18, raw_data: null, created_at: '2020-01-01' },
  { id: 'tx-051-05', property_id: 'prop-051', transaction_amount: 185000, transaction_year: 2021, transaction_month: 8, transaction_day: 15, exclusive_area: 149.47, floor: 12, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-051-06', property_id: 'prop-051', transaction_amount: 175000, transaction_year: 2022, transaction_month: 10, transaction_day: 8, exclusive_area: 149.47, floor: 20, raw_data: null, created_at: '2022-01-01' },
  { id: 'tx-051-07', property_id: 'prop-051', transaction_amount: 195000, transaction_year: 2024, transaction_month: 3, transaction_day: 20, exclusive_area: 149.47, floor: 14, raw_data: null, created_at: '2024-01-01' },

  // ── prop-054 신현대 9,11,12차 (오세훈, 손흥민) ─────────────
  { id: 'tx-054-01', property_id: 'prop-054', transaction_amount: 120000, transaction_year: 2017, transaction_month: 5, transaction_day: 22, exclusive_area: 155.0, floor: 5, raw_data: null, created_at: '2017-01-01' },
  { id: 'tx-054-02', property_id: 'prop-054', transaction_amount: 155000, transaction_year: 2018, transaction_month: 10, transaction_day: 8, exclusive_area: 155.0, floor: 8, raw_data: null, created_at: '2018-01-01' },
  { id: 'tx-054-03', property_id: 'prop-054', transaction_amount: 195000, transaction_year: 2019, transaction_month: 12, transaction_day: 15, exclusive_area: 155.0, floor: 3, raw_data: null, created_at: '2019-01-01' },
  { id: 'tx-054-04', property_id: 'prop-054', transaction_amount: 230000, transaction_year: 2020, transaction_month: 11, transaction_day: 5, exclusive_area: 155.0, floor: 10, raw_data: null, created_at: '2020-01-01' },
  { id: 'tx-054-05', property_id: 'prop-054', transaction_amount: 270000, transaction_year: 2021, transaction_month: 7, transaction_day: 18, exclusive_area: 155.0, floor: 6, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-054-06', property_id: 'prop-054', transaction_amount: 300000, transaction_year: 2023, transaction_month: 4, transaction_day: 12, exclusive_area: 155.0, floor: 12, raw_data: null, created_at: '2023-01-01' },

  // ── prop-096 방배동 아파트 (조국) ─────────────────────────
  { id: 'tx-096-01', property_id: 'prop-096', transaction_amount: 55000, transaction_year: 2017, transaction_month: 6, transaction_day: 10, exclusive_area: 134.0, floor: 5, raw_data: null, created_at: '2017-01-01' },
  { id: 'tx-096-02', property_id: 'prop-096', transaction_amount: 72000, transaction_year: 2018, transaction_month: 11, transaction_day: 22, exclusive_area: 134.0, floor: 8, raw_data: null, created_at: '2018-01-01' },
  { id: 'tx-096-03', property_id: 'prop-096', transaction_amount: 95000, transaction_year: 2020, transaction_month: 3, transaction_day: 15, exclusive_area: 134.0, floor: 3, raw_data: null, created_at: '2020-01-01' },
  { id: 'tx-096-04', property_id: 'prop-096', transaction_amount: 130000, transaction_year: 2021, transaction_month: 8, transaction_day: 5, exclusive_area: 134.0, floor: 10, raw_data: null, created_at: '2021-01-01' },
  { id: 'tx-096-05', property_id: 'prop-096', transaction_amount: 167000, transaction_year: 2023, transaction_month: 5, transaction_day: 20, exclusive_area: 134.0, floor: 7, raw_data: null, created_at: '2023-01-01' },
]
