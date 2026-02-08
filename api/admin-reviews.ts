import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('approved', false)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return res.status(500).json({ error: 'Failed to fetch reviews' })
    }

    return res.status(200).json({ success: true, reviews: data })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}