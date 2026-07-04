import { motion } from 'framer-motion'
import { FiHome, FiMessageSquare, FiUsers, FiTrendingUp, FiEye, FiStar, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Link } from 'react-router-dom'
import { DEMO_PROPERTIES } from '@/lib/utils/demoData'
import { formatPrice, relativeTime } from '@/lib/utils/format'

const STATS = [
  { label: 'Total Properties', value: '2,547', change: '+12%', up: true, icon: FiHome, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { label: "Today's Inquiries", value: '18', change: '+3', up: true, icon: FiMessageSquare, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
  { label: 'Active Agents', value: '82', change: '+2', up: true, icon: FiUsers, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  { label: 'Page Views', value: '12.4K', change: '+8.2%', up: true, icon: FiEye, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
]

const REVENUE_DATA = [
  { month: 'Jan', revenue: 42, inquiries: 28 },
  { month: 'Feb', revenue: 58, inquiries: 35 },
  { month: 'Mar', revenue: 45, inquiries: 30 },
  { month: 'Apr', revenue: 75, inquiries: 48 },
  { month: 'May', revenue: 90, inquiries: 60 },
  { month: 'Jun', revenue: 68, inquiries: 42 },
  { month: 'Jul', revenue: 110, inquiries: 72 },
]

const RECENT_ACTIVITY = [
  { type: 'inquiry', text: 'New inquiry for DHA Phase 6 Villa', time: '2025-06-28T10:30:00Z', status: 'new' },
  { type: 'property', text: 'Property "Gulberg Plaza" marked as Sold', time: '2025-06-28T09:15:00Z', status: 'sold' },
  { type: 'review', text: 'New 5-star review from Ahmad Khan', time: '2025-06-28T08:00:00Z', status: 'review' },
  { type: 'inquiry', text: 'New inquiry for Bahria Town Apartment', time: '2025-06-27T16:45:00Z', status: 'new' },
]

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text)]">Welcome back, Admin</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Here's what's happening with your portfolio today.</p>
        </div>
        <Badge variant="success" className="gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          All systems operational
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-semibold ${stat.up ? 'text-green-600' : 'text-red-500'}`}>
                    {stat.up ? <FiArrowUpRight className="h-3.5 w-3.5" /> : <FiArrowDownRight className="h-3.5 w-3.5" />}
                    {stat.change}
                  </span>
                </div>
                <p className="font-display text-2xl font-black text-[var(--text)]">{stat.value}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Area Chart */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Revenue & Inquiries (2025)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F5A623" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F5A623" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="inquiries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--border)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--border)" />
                <Tooltip
                  contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}
                  labelStyle={{ color: 'var(--text)', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#F5A623" fill="url(#revenue)" strokeWidth={2} name="Revenue (M)" />
                <Area type="monotone" dataKey="inquiries" stroke="#4F46E5" fill="url(#inquiries)" strokeWidth={2} name="Inquiries" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[var(--border)]">
              {RECENT_ACTIVITY.map((item, i) => (
                <div key={i} className="flex gap-3 p-4">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.type === 'inquiry' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    item.type === 'property' ? 'bg-green-100 dark:bg-green-900/30' :
                    'bg-amber-100 dark:bg-amber-900/30'
                  }`}>
                    {item.type === 'inquiry' ? <FiMessageSquare className="h-3.5 w-3.5 text-blue-500" /> :
                     item.type === 'property' ? <FiHome className="h-3.5 w-3.5 text-green-500" /> :
                     <FiStar className="h-3.5 w-3.5 text-amber-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[var(--text)] leading-snug">{item.text}</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{relativeTime(item.time)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Properties */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Top Properties</CardTitle>
            <Link to="/admin/properties" className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1">
              View all <FiArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {['Property', 'Type', 'Price', 'Views', 'Status'].map((h) => (
                    <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {DEMO_PROPERTIES.slice(0, 5).map((p) => (
                  <tr key={p.id} className="hover:bg-[var(--surface)] transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="h-10 w-14 rounded-lg object-cover flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-[var(--text)] line-clamp-1">{p.title}</p>
                          <p className="text-xs text-[var(--text-muted)]">{p.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3"><Badge variant="secondary" className="capitalize text-xs">{p.property_type}</Badge></td>
                    <td className="py-3 px-3 text-sm font-semibold text-[var(--primary)]">{formatPrice(p.price, p.currency)}</td>
                    <td className="py-3 px-3 text-sm text-[var(--text-muted)]">{p.view_count}</td>
                    <td className="py-3 px-3">
                      <Badge variant={p.property_status === 'available' ? 'success' : 'danger'} className="capitalize text-xs">
                        {p.property_status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
