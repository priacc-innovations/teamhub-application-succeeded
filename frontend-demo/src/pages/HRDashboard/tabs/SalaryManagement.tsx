import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Download, DollarSign, TrendingDown, Plus, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

interface Employee {
  id: string;
  employee_id: string;
  full_name: string;
  department: string;
  monthly_salary: number;
  total_deductions: number;
  net_salary: number;
  days_present: number;
  days_absent: number;
}

interface Deduction {
  id: string;
  employee_id: string;
  month: number;
  year: number;
  amount: number;
  reason: string;
}

export default function SalaryManagement() {
  const [showAddDeduction, setShowAddDeduction] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');

  const [employees] = useState<Employee[]>([
    {
      id: '1',
      employee_id: 'EMP001',
      full_name: 'John Doe',
      department: 'Engineering',
      monthly_salary: 60000,
      total_deductions: 5000,
      net_salary: 55000,
      days_present: 22,
      days_absent: 2,
    },
    {
      id: '2',
      employee_id: 'EMP002',
      full_name: 'Jane Smith',
      department: 'Sales',
      monthly_salary: 65000,
      total_deductions: 3000,
      net_salary: 62000,
      days_present: 24,
      days_absent: 0,
    },
    {
      id: '3',
      employee_id: 'EMP003',
      full_name: 'Mike Johnson',
      department: 'Marketing',
      monthly_salary: 55000,
      total_deductions: 8000,
      net_salary: 47000,
      days_present: 20,
      days_absent: 4,
    },
    {
      id: '4',
      employee_id: 'EMP004',
      full_name: 'Sarah Williams',
      department: 'Data Science',
      monthly_salary: 70000,
      total_deductions: 2000,
      net_salary: 68000,
      days_present: 23,
      days_absent: 1,
    },
    {
      id: '5',
      employee_id: 'EMP005',
      full_name: 'David Brown',
      department: 'Engineering',
      monthly_salary: 58000,
      total_deductions: 4500,
      net_salary: 53500,
      days_present: 21,
      days_absent: 3,
    },
    {
      id: '6',
      employee_id: 'EMP006',
      full_name: 'Emily Davis',
      department: 'Sales',
      monthly_salary: 62000,
      total_deductions: 6000,
      net_salary: 56000,
      days_present: 22,
      days_absent: 2,
    },
    {
      id: '7',
      employee_id: 'EMP007',
      full_name: 'Chris Wilson',
      department: 'Design',
      monthly_salary: 54000,
      total_deductions: 3500,
      net_salary: 50500,
      days_present: 23,
      days_absent: 1,
    },
    {
      id: '8',
      employee_id: 'EMP008',
      full_name: 'Lisa Anderson',
      department: 'HR',
      monthly_salary: 56000,
      total_deductions: 2500,
      net_salary: 53500,
      days_present: 24,
      days_absent: 0,
    },
    {
      id: '9',
      employee_id: 'EMP009',
      full_name: 'Robert Taylor',
      department: 'Finance',
      monthly_salary: 68000,
      total_deductions: 5500,
      net_salary: 62500,
      days_present: 22,
      days_absent: 2,
    },
    {
      id: '10',
      employee_id: 'EMP010',
      full_name: 'Jennifer Martinez',
      department: 'Operations',
      monthly_salary: 59000,
      total_deductions: 4000,
      net_salary: 55000,
      days_present: 21,
      days_absent: 3,
    },
  ]);

  const [deductionForm, setDeductionForm] = useState({
    amount: '',
    reason: '',
  });

  const totalSalaries = employees.reduce((sum, emp) => sum + emp.monthly_salary, 0);
  const totalDeductions = employees.reduce((sum, emp) => sum + emp.total_deductions, 0);
  const totalNetSalaries = employees.reduce((sum, emp) => sum + emp.net_salary, 0);

  const downloadCSV = () => {
    const headers = [
      'Employee ID',
      'Full Name',
      'Department',
      'Monthly Salary',
      'Total Deductions',
      'Net Salary',
      'Days Present',
      'Days Absent',
      'Attendance %',
    ];

    const rows = employees.map((emp) => [
      emp.employee_id,
      emp.full_name,
      emp.department,
      emp.monthly_salary,
      emp.total_deductions,
      emp.net_salary,
      emp.days_present,
      emp.days_absent,
      ((emp.days_present / (emp.days_present + emp.days_absent)) * 100).toFixed(2) + '%',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
      '',
      `Total Salaries,,,${totalSalaries}`,
      `Total Deductions,,,${totalDeductions}`,
      `Total Net Salaries,,,${totalNetSalaries}`,
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `salary_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleAddDeduction = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding deduction for:', selectedEmployee, deductionForm);
    setShowAddDeduction(false);
    setDeductionForm({ amount: '', reason: '' });
    setSelectedEmployee('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Salary Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage employee salaries, deductions, and export reports
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowAddDeduction(true)} variant="outline" className="gap-2">
            <Plus className="w-5 h-5" />
            Add Deduction
          </Button>
          <Button onClick={downloadCSV} className="gap-2">
            <Download className="w-5 h-5" />
            Download CSV Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card glassmorphism>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Salaries</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${totalSalaries.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card glassmorphism>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Deductions</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  ${totalDeductions.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card glassmorphism>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Net Payable</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${totalNetSalaries.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showAddDeduction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddDeduction(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Add Salary Deduction
            </h2>
            <form onSubmit={handleAddDeduction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Employee *
                </label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.employee_id} - {emp.full_name}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Deduction Amount *"
                type="number"
                value={deductionForm.amount}
                onChange={(e) =>
                  setDeductionForm({ ...deductionForm, amount: e.target.value })
                }
                placeholder="5000"
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason *
                </label>
                <textarea
                  value={deductionForm.reason}
                  onChange={(e) =>
                    setDeductionForm({ ...deductionForm, reason: e.target.value })
                  }
                  placeholder="e.g., Performance penalty, Advance deduction, etc."
                  required
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <Button type="submit" className="flex-1">
                  Add Deduction
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddDeduction(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              Note: Deduction will be reflected in employee's wallet as "Promise to Pay"
            </p>
          </motion.div>
        </motion.div>
      )}

      <Card glassmorphism>
        <CardHeader>
          <CardTitle>Employee Salary Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    EMP ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Department
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Base Salary
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Deductions
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Net Salary
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Attendance
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, index) => (
                  <motion.tr
                    key={employee.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                      {employee.employee_id}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                      {employee.full_name}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {employee.department}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-gray-900 dark:text-white">
                      ${employee.monthly_salary.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-red-600 dark:text-red-400">
                      ${employee.total_deductions.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-bold text-green-600 dark:text-green-400">
                      ${employee.net_salary.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-center">
                      <span className="text-gray-700 dark:text-gray-300">
                        {employee.days_present}/{employee.days_present + employee.days_absent}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 dark:bg-gray-800/50 font-semibold">
                  <td colSpan={3} className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    TOTAL
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-900 dark:text-white">
                    ${totalSalaries.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-red-600 dark:text-red-400">
                    ${totalDeductions.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-green-600 dark:text-green-400">
                    ${totalNetSalaries.toLocaleString()}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
