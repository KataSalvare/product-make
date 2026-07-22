import React from 'react'
import { FileText, LayoutTemplate, Palette, Smartphone, Sparkles } from 'lucide-react'

export const HomePage: React.FC = () => {
  return (
    <div className="h-full w-full overflow-auto p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg mb-6">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            欢迎使用原型工具
            <span className="ml-3 text-xs font-normal text-gray-400 align-middle">v2.0 · by Kata</span>
          </h1>
          <p className="text-gray-500 text-lg">快速预览原型、管理设计系统主题、查看项目文档</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="block bg-white rounded-xl shadow-sm border p-6">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              <Smartphone className="text-blue-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">原型页面</h3>
            <p className="text-sm text-gray-500">在左侧菜单选择原型页面，右侧预览区即可查看效果</p>
          </div>
          <div className="block bg-white rounded-xl shadow-sm border p-6">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              <Palette className="text-blue-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">设计系统主题</h3>
            <p className="text-sm text-gray-500">切换到「主题」标签，浏览项目中已有的设计系统主题</p>
          </div>
          <div className="block bg-white rounded-xl shadow-sm border p-6">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              <FileText className="text-blue-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">项目文档</h3>
            <p className="text-sm text-gray-500">切换到「文档」标签，查看规格、PRD 等项目文档</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <LayoutTemplate size={20} className="text-blue-600" />
            快速开始
          </h2>

          <div className="space-y-6">
            <section>
              <h3 className="text-base font-semibold text-gray-900 mb-2">1、如何查看原型页面</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                在左侧边栏选择「原型」分类，点击页面名称即可在右侧预览区查看效果。前端页面默认以移动端尺寸展示，后台页面默认以 PC 尺寸展示。
              </p>
            </section>

            <section>
              <h3 className="text-base font-semibold text-gray-900 mb-2">2、如何创建原型页面</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                将需求直接告诉 AI 即可。AI 会先阅读项目规则（如 <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">rules/prototype-development-guide.md</code>），确认目标用户、核心任务和范围后，引导你完成原型创建，无需手动操作文件。
              </p>
            </section>

            <section>
              <h3 className="text-base font-semibold text-gray-900 mb-2">3、如何使用批注功能</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                点击顶部工具栏的「启用批注」进入编辑模式，选择页面元素后可添加批注、选择分类并保存到草稿。批注列表可在右侧文档面板的「批注」标签中查看，保存后会写入本地文件。
              </p>
            </section>

            <section>
              <h3 className="text-base font-semibold text-gray-900 mb-2">4、复制到 Figma 如何使用</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                打开任意原型页面后，点击顶部工具栏的「复制到 Figma」按钮，系统会将当前页面内容转换为 Figma 可识别的 HTML 结构，前往 Figma 粘贴成设计稿。批注层不会被复制。
              </p>
            </section>

            <section>
              <h3 className="text-base font-semibold text-gray-900 mb-2">5、快捷键如何配置</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                点击顶部工具栏的「快捷键」按钮，在弹窗中可查看和修改各项快捷键。默认配置：复制到 Figma 为 Ctrl+Cmd+C，查看文档为 Ctrl+Cmd+E，批注选择元素为 Ctrl+Cmd+S（Windows 为 Ctrl+Alt+S）。
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
