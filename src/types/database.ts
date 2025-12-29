export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  newsletter: {
    Tables: {
      subscribers: {
        Row: {
          id: string
          email: string
          name: string | null
          status: 'active' | 'unsubscribed' | 'bounced'
          subscribed_at: string
          unsubscribed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          status?: 'active' | 'unsubscribed' | 'bounced'
          subscribed_at?: string
          unsubscribed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          status?: 'active' | 'unsubscribed' | 'bounced'
          subscribed_at?: string
          unsubscribed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletters: {
        Row: {
          id: string
          title: string
          content: string
          excerpt: string | null
          status: 'draft' | 'scheduled' | 'sent'
          scheduled_at: string | null
          sent_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          excerpt?: string | null
          status?: 'draft' | 'scheduled' | 'sent'
          scheduled_at?: string | null
          sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          excerpt?: string | null
          status?: 'draft' | 'scheduled' | 'sent'
          scheduled_at?: string | null
          sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          id: string
          name: string
          role: string
          content: string
          rating: number
          is_featured: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          role: string
          content: string
          rating: number
          is_featured?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string
          content?: string
          rating?: number
          is_featured?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          id: string
          newsletter_id: string
          subscriber_id: string
          sent_at: string
          opened_at: string | null
          clicked_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          newsletter_id: string
          subscriber_id: string
          sent_at?: string
          opened_at?: string | null
          clicked_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          newsletter_id?: string
          subscriber_id?: string
          sent_at?: string
          opened_at?: string | null
          clicked_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_subscribers_newsletter_id_fkey"
            columns: ["newsletter_id"]
            isOneToOne: false
            referencedRelation: "newsletters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newsletter_subscribers_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_ratings: {
        Row: {
          id: string
          newsletter_id: string
          user_id: string
          rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          newsletter_id: string
          user_id: string
          rating: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          newsletter_id?: string
          user_id?: string
          rating?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_ratings_newsletter_id_fkey"
            columns: ["newsletter_id"]
            isOneToOne: false
            referencedRelation: "newsletters"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier access
export type NewsletterSubscriber = Database['newsletter']['Tables']['subscribers']['Row']
export type NewsletterSubscriberInsert = Database['newsletter']['Tables']['subscribers']['Insert']
export type NewsletterSubscriberUpdate = Database['newsletter']['Tables']['subscribers']['Update']

export type Newsletter = Database['newsletter']['Tables']['newsletters']['Row']
export type NewsletterInsert = Database['newsletter']['Tables']['newsletters']['Insert']
export type NewsletterUpdate = Database['newsletter']['Tables']['newsletters']['Update']

export type Testimonial = Database['newsletter']['Tables']['testimonials']['Row']
export type TestimonialInsert = Database['newsletter']['Tables']['testimonials']['Insert']
export type TestimonialUpdate = Database['newsletter']['Tables']['testimonials']['Update']

export type NewsletterSubscriberLink = Database['newsletter']['Tables']['newsletter_subscribers']['Row']
export type NewsletterSubscriberLinkInsert = Database['newsletter']['Tables']['newsletter_subscribers']['Insert']
export type NewsletterSubscriberLinkUpdate = Database['newsletter']['Tables']['newsletter_subscribers']['Update']

export type NewsletterRating = Database['newsletter']['Tables']['newsletter_ratings']['Row']
export type NewsletterRatingInsert = Database['newsletter']['Tables']['newsletter_ratings']['Insert']
export type NewsletterRatingUpdate = Database['newsletter']['Tables']['newsletter_ratings']['Update']
