import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, rating, message } = req.body

    if (!name || !rating || !message) {
      return res.status(400).json({ error: 'Missing fields' })
    }

    const { error } = await supabase
      .from('reviews')
      .insert([{ name, rating, message, approved: false }])

    if (error) {
      console.error(error)
      return res.status(500).json({ error: 'Failed to submit review' })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}