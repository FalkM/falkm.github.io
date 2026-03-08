export interface Link {
  id: string
  url: string
  title: string | null
  status: LinkStatus
  created_at: string
  updated_at: string
}