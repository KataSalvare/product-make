import React from 'react'
import { FileText, LayoutTemplate, Palette, Smartphone, SlidersHorizontal, Sparkles } from 'lucide-react'

export const HomePage: React.FC = () => {
  return (
    <div className="h-full w-full overflow-auto bg-[var(--tool-background)] px-5 py-4 text-[var(--tool-text)] lg:px-6 lg:py-5">
      <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col justify-center gap-8 px-1 py-8 lg:gap-10 lg:py-12">
        <header className="flex items-center gap-4">
          <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--tool-brand)] shadow-lg shadow-indigo-950/15 ring-1 ring-white/20">
            <Sparkles className="text-white" size={24} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
              <h1 className="text-2xl font-bold tracking-tight text-[var(--tool-text)]">欢迎使用原型工具</h1>
              <span className="text-xs font-medium text-[var(--tool-text-subtle)]">v3.0 · by Kata</span>
            </div>
            <p className="mt-1 text-sm text-[var(--tool-text-muted)]">快速预览原型、管理设计系统主题、查看项目文档</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group flex min-h-[148px] flex-col rounded-2xl bg-[var(--tool-surface)] p-5 shadow-[var(--tool-shadow-panel)] transition-transform duration-200 hover:-translate-y-0.5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--tool-brand-soft)]">
              <Smartphone className="text-[var(--tool-brand)]" size={19} />
            </div>
            <h2 className="text-sm font-semibold text-[var(--tool-text)]">原型页面</h2>
            <p className="mt-1.5 text-xs leading-5 text-[var(--tool-text-muted)]">从左侧选择页面，在预览区查看效果。</p>
          </div>
          <div className="group flex min-h-[148px] flex-col rounded-2xl bg-[var(--tool-surface)] p-5 shadow-[var(--tool-shadow-panel)] transition-transform duration-200 hover:-translate-y-0.5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--tool-brand-soft)]">
              <Palette className="text-[var(--tool-brand)]" size={19} />
            </div>
            <h2 className="text-sm font-semibold text-[var(--tool-text)]">设计系统主题</h2>
            <p className="mt-1.5 text-xs leading-5 text-[var(--tool-text-muted)]">浏览项目中已有的设计系统主题。</p>
          </div>
          <div className="group flex min-h-[148px] flex-col rounded-2xl bg-[var(--tool-surface)] p-5 shadow-[var(--tool-shadow-panel)] transition-transform duration-200 hover:-translate-y-0.5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--tool-brand-soft)]">
              <SlidersHorizontal className="text-[var(--tool-brand)]" size={19} />
            </div>
            <h2 className="text-sm font-semibold text-[var(--tool-text)]">页面状态面板</h2>
            <p className="mt-1.5 text-xs leading-5 text-[var(--tool-text-muted)]">从顶部状态入口切换页面状态。</p>
          </div>
          <div className="group flex min-h-[148px] flex-col rounded-2xl bg-[var(--tool-surface)] p-5 shadow-[var(--tool-shadow-panel)] transition-transform duration-200 hover:-translate-y-0.5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--tool-brand-soft)]">
              <FileText className="text-[var(--tool-brand)]" size={19} />
            </div>
            <h2 className="text-sm font-semibold text-[var(--tool-text)]">项目文档</h2>
            <p className="mt-1.5 text-xs leading-5 text-[var(--tool-text-muted)]">查看规格、PRD 等项目文档。</p>
          </div>
        </div>

        <section className="rounded-2xl bg-[var(--tool-surface)] p-5 shadow-[var(--tool-shadow-panel)] lg:p-7">
          <h2 className="mb-6 flex items-center gap-2 text-base font-semibold text-[var(--tool-text)]">
            <LayoutTemplate size={18} className="text-[var(--tool-brand)]" />
            快速开始
          </h2>

          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-8">
            <section>
              <h3 className="text-xs font-semibold text-[var(--tool-text)]">1、如何查看原型页面</h3>
              <p className="mt-1.5 text-xs leading-5 text-[var(--tool-text-muted)]">在左侧选择「原型」分类和页面。前端默认移动端展示，后台默认 PC 展示。</p>
            </section>
            <section>
              <h3 className="text-xs font-semibold text-[var(--tool-text)]">2、如何创建原型页面</h3>
              <p className="mt-1.5 text-xs leading-5 text-[var(--tool-text-muted)]">描述想法即可，AI 会先做需求对齐再开始。例如：</p>
              <p className="mt-1.5 rounded-md bg-[var(--tool-brand-soft)] px-2 py-1 text-[11px] leading-5 text-[var(--tool-brand-hover)]">我想做一个「订单管理」后台，先帮我确认需求和页面范围</p>
            </section>
            <section>
              <h3 className="text-xs font-semibold text-[var(--tool-text)]">3、如何创建主题</h3>
              <p className="mt-1.5 text-xs leading-5 text-[var(--tool-text-muted)]">描述风格偏好即可，AI 会先给出方案再实施。例如：</p>
              <p className="mt-1.5 rounded-md bg-[var(--tool-brand-soft)] px-2 py-1 text-[11px] leading-5 text-[var(--tool-brand-hover)]">我想要一个深蓝渐变、玻璃拟态风格的主题，先给我设计方向</p>
            </section>
            <section>
              <h3 className="text-xs font-semibold text-[var(--tool-text)]">4、如何使用批注功能</h3>
              <p className="mt-1.5 text-xs leading-5 text-[var(--tool-text-muted)]">点击「批注」进入编辑模式，点选页面元素添加说明；可用眼睛图标显示或隐藏批注，完成后点击「保存」，按 ESC 退出编辑。</p>
            </section>
            <section>
              <h3 className="text-xs font-semibold text-[var(--tool-text)]">5、如何复制到 Figma</h3>
              <p className="mt-1.5 text-xs leading-5 text-[var(--tool-text-muted)]">在 Figma 中运行对应的导入插件，点击「复制到 Figma」，回到 Figma 粘贴即可得到可编辑的设计稿。批注不会被复制。</p>
            </section>
            <section>
              <h3 className="text-xs font-semibold text-[var(--tool-text)]">6、如何复制到 Axure</h3>
              <p className="mt-1.5 text-xs leading-5 text-[var(--tool-text-muted)]">先打开 Axure RP 10 及以上版本并保持目标文件处于打开状态，点击「复制到 Axure」或按 <kbd className="rounded bg-[var(--tool-brand-soft)] px-1 py-0.5 text-[11px] text-[var(--tool-brand-hover)]">⌃⌘X</kbd>，回到画布粘贴即可得到可编辑的矩形、文本和图片。</p>
            </section>
            <section>
              <h3 className="text-xs font-semibold text-[var(--tool-text)]">7、如何使用页面状态</h3>
              <p className="mt-1.5 text-xs leading-5 text-[var(--tool-text-muted)]">点击顶部的「状态」入口，可在正常、加载中、空数据、异常等状态间切换，查看页面在不同数据情况下的表现。</p>
            </section>
            <section>
              <h3 className="text-xs font-semibold text-[var(--tool-text)]">8、快捷键如何配置</h3>
              <p className="mt-1.5 text-xs leading-5 text-[var(--tool-text-muted)]">点击「快捷键」查看或修改配置，支持 Ctrl/Cmd、Shift、Alt 等组合键。</p>
            </section>
          </div>
        </section>
      </div>
    </div>
  )
}
