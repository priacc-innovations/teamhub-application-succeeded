import { Users, CheckCircle, TrendingUp, Calendar } from 'lucide-react';
import StatCard from '../../../components/shared/StatCard';

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          HR Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage employees, attendance, and performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={50}
          icon={Users}
          color="blue"
          delay={0}
        />
        <StatCard
          title="Present Today"
          value={45}
          icon={CheckCircle}
          color="green"
          delay={0.1}
        />
        <StatCard
          title="Avg Performance"
          value="4.2/5"
          icon={TrendingUp}
          color="purple"
          delay={0.2}
        />
        <StatCard
          title="On Leave"
          value={5}
          icon={Calendar}
          color="orange"
          delay={0.3}
        />
      </div>
    </div>
  );
}
