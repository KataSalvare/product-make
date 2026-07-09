/**
 * @name 用户管理
 *
 * 后台用户管理页面，支持用户列表查看、搜索和状态管理
 */

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import './style.css'

interface User {
  id: number
  username: string
  email: string
  status: 'active' | 'inactive' | 'banned'
  createdAt: string
}

const MOCK_USERS: User[] = [
  { id: 1, username: '张三', email: 'zhangsan@example.com', status: 'active', createdAt: '2026-01-15' },
  { id: 2, username: '李四', email: 'lisi@example.com', status: 'active', createdAt: '2026-02-20' },
  { id: 3, username: '王五', email: 'wangwu@example.com', status: 'inactive', createdAt: '2026-03-10' },
  { id: 4, username: '赵六', email: 'zhaoliu@example.com', status: 'active', createdAt: '2026-04-05' },
  { id: 5, username: '孙七', email: 'sunqi@example.com', status: 'banned', createdAt: '2026-05-18' },
  { id: 6, username: '周八', email: 'zhouba@example.com', status: 'active', createdAt: '2026-06-01' },
  { id: 7, username: '吴九', email: 'wujiu@example.com', status: 'inactive', createdAt: '2026-06-22' },
  { id: 8, username: '郑十', email: 'zhengshi@example.com', status: 'active', createdAt: '2026-07-01' },
]

const STATUS_MAP: Record<User['status'], { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  active: { label: '正常', variant: 'default' },
  inactive: { label: '未激活', variant: 'secondary' },
  banned: { label: '已封禁', variant: 'destructive' },
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredUsers = MOCK_USERS.filter(
    (user) =>
      user.username.includes(searchQuery) || user.email.includes(searchQuery)
  )

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">用户管理</h1>
        <p className="text-sm text-muted-foreground mt-1">管理系统中的所有用户账号</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>用户列表</CardTitle>
              <CardDescription>共 {filteredUsers.length} 条记录</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Input
                placeholder="搜索用户名或邮箱..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
              <Button>添加用户</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">用户名</th>
                  <th className="pb-3 font-medium">邮箱</th>
                  <th className="pb-3 font-medium">状态</th>
                  <th className="pb-3 font-medium">注册时间</th>
                  <th className="pb-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b last:border-0">
                    <td className="py-3 text-muted-foreground">{user.id}</td>
                    <td className="py-3 font-medium">{user.username}</td>
                    <td className="py-3 text-muted-foreground">{user.email}</td>
                    <td className="py-3">
                      <Badge variant={STATUS_MAP[user.status].variant}>
                        {STATUS_MAP[user.status].label}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">{user.createdAt}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">编辑</Button>
                        <Button variant="ghost" size="sm" className="text-destructive">删除</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                没有找到匹配的用户
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
