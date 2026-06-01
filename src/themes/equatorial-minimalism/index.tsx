import React, { useState } from 'react';
import { Button } from './components/Button';
import { Card } from './components/Card';
import { Input } from './components/Input';
import { Avatar } from './components/Avatar';
import { LoginTemplate } from './templates/LoginTemplate';
import { ChatTemplate } from './templates/ChatTemplate';
import './globals.css';

const EquatorialMinimalismTheme: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'components' | 'login' | 'chat'>('components');
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--primary)] rounded-lg flex items-center justify-center">
                <span className="text-[var(--on-primary)] font-bold text-lg">E</span>
              </div>
              <div>
                <h1 className="text-headline-md text-[var(--primary)]">Equatorial Minimalism</h1>
                <p className="text-label-sm text-[var(--on-surface-variant)]">African IM Design System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-[var(--surface-container)] transition-colors"
              >
                {darkMode ? (
                  <svg className="w-5 h-5 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <div className="flex gap-2">
                {(['components', 'login', 'chat'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-label-md transition-colors ${
                      activeTab === tab
                        ? 'bg-[var(--secondary)] text-[var(--on-secondary)]'
                        : 'text-[var(--on-surface)] hover:bg-[var(--surface-container)]'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      {activeTab === 'components' && (
        <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
          {/* Hero Section */}
          <section className="text-center py-16">
            <h2 className="text-headline-xl text-[var(--primary)] mb-4">
              Modern Minimalism for Africa
            </h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
              A high-end, contemporary aesthetic tailored for a modern African context. 
              Balancing the warmth of the earth with the precision of modern minimalism.
            </p>
          </section>

          {/* Colors Section */}
          <section>
            <h3 className="text-headline-lg text-[var(--primary)] mb-8">Color Palette</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ColorSwatch name="Primary" color="var(--primary)" textColor="var(--on-primary)" />
              <ColorSwatch name="Secondary" color="var(--secondary)" textColor="var(--on-secondary)" />
              <ColorSwatch name="Surface" color="var(--surface)" textColor="var(--on-surface)" />
              <ColorSwatch name="Surface Container" color="var(--surface-container)" textColor="var(--on-surface)" />
              <ColorSwatch name="Tertiary" color="var(--tertiary)" textColor="var(--on-tertiary)" />
              <ColorSwatch name="Error" color="var(--error)" textColor="var(--on-error)" />
              <ColorSwatch name="Outline" color="var(--outline)" textColor="var(--surface)" />
              <ColorSwatch name="Surface Variant" color="var(--surface-variant)" textColor="var(--on-surface-variant)" />
            </div>
          </section>

          {/* Typography Section */}
          <section>
            <h3 className="text-headline-lg text-[var(--primary)] mb-8">Typography</h3>
            <Card padding="lg">
              <div className="space-y-6">
                <div>
                  <p className="text-label-sm text-[var(--on-surface-variant)] mb-2">Headline XL (48px)</p>
                  <p className="text-headline-xl text-[var(--primary)]">The quick brown fox</p>
                </div>
                <div>
                  <p className="text-label-sm text-[var(--on-surface-variant)] mb-2">Headline LG (32px)</p>
                  <p className="text-headline-lg text-[var(--primary)]">The quick brown fox</p>
                </div>
                <div>
                  <p className="text-label-sm text-[var(--on-surface-variant)] mb-2">Headline MD (24px)</p>
                  <p className="text-headline-md text-[var(--primary)]">The quick brown fox</p>
                </div>
                <div>
                  <p className="text-label-sm text-[var(--on-surface-variant)] mb-2">Body LG (18px)</p>
                  <p className="text-body-lg text-[var(--on-surface)]">The quick brown fox jumps over the lazy dog</p>
                </div>
                <div>
                  <p className="text-label-sm text-[var(--on-surface-variant)] mb-2">Body MD (16px)</p>
                  <p className="text-body-md text-[var(--on-surface)]">The quick brown fox jumps over the lazy dog</p>
                </div>
                <div>
                  <p className="text-label-sm text-[var(--on-surface-variant)] mb-2">Label MD (14px)</p>
                  <p className="text-label-md text-[var(--on-surface)]">Label Text</p>
                </div>
              </div>
            </Card>
          </section>

          {/* Buttons Section */}
          <section>
            <h3 className="text-headline-lg text-[var(--primary)] mb-8">Buttons</h3>
            <Card padding="lg">
              <div className="space-y-8">
                <div>
                  <p className="text-label-sm text-[var(--on-surface-variant)] mb-4">Variants</p>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                  </div>
                </div>
                <div>
                  <p className="text-label-sm text-[var(--on-surface-variant)] mb-4">Sizes</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Inputs Section */}
          <section>
            <h3 className="text-headline-lg text-[var(--primary)] mb-8">Inputs</h3>
            <Card padding="lg">
              <div className="space-y-6 max-w-md">
                <Input label="Default Input" placeholder="Enter text..." />
                <Input label="With Helper" placeholder="Enter text..." helperText="This is a helper text" />
                <Input label="Error State" placeholder="Enter text..." error="This field is required" />
              </div>
            </Card>
          </section>

          {/* Avatars Section */}
          <section>
            <h3 className="text-headline-lg text-[var(--primary)] mb-8">Avatars</h3>
            <Card padding="lg">
              <div className="space-y-8">
                <div>
                  <p className="text-label-sm text-[var(--on-surface-variant)] mb-4">Sizes</p>
                  <div className="flex items-center gap-4">
                    <Avatar name="Amara Okafor" size="sm" />
                    <Avatar name="Amara Okafor" size="md" />
                    <Avatar name="Amara Okafor" size="lg" />
                    <Avatar name="Amara Okafor" size="xl" />
                  </div>
                </div>
                <div>
                  <p className="text-label-sm text-[var(--on-surface-variant)] mb-4">With Status</p>
                  <div className="flex items-center gap-4">
                    <Avatar name="Amara Okafor" size="md" status="online" />
                    <Avatar name="Amara Okafor" size="md" status="offline" />
                    <Avatar name="Amara Okafor" size="md" status="away" />
                    <Avatar name="Amara Okafor" size="md" status="busy" />
                  </div>
                </div>
                <div>
                  <p className="text-label-sm text-[var(--on-surface-variant)] mb-4">Shapes</p>
                  <div className="flex items-center gap-4">
                    <Avatar name="Amara Okafor" size="lg" shape="circle" />
                    <Avatar name="Amara Okafor" size="lg" shape="rounded" />
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Cards Section */}
          <section>
            <h3 className="text-headline-lg text-[var(--primary)] mb-8">Cards</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card padding="sm" shadow="sm">
                <h4 className="text-headline-md text-[var(--primary)] mb-2">Small Padding</h4>
                <p className="text-body-md text-[var(--on-surface)]">Small shadow with minimal padding</p>
              </Card>
              <Card padding="md" shadow="md">
                <h4 className="text-headline-md text-[var(--primary)] mb-2">Medium Padding</h4>
                <p className="text-body-md text-[var(--on-surface)]">Medium shadow with standard padding</p>
              </Card>
              <Card padding="lg" shadow="lg">
                <h4 className="text-headline-md text-[var(--primary)] mb-2">Large Padding</h4>
                <p className="text-body-md text-[var(--on-surface)]">Large shadow with generous padding</p>
              </Card>
            </div>
          </section>

          {/* Shadows Section */}
          <section>
            <h3 className="text-headline-lg text-[var(--primary)] mb-8">Ambient Shadows</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <ShadowDemo name="Small" className="shadow-ambient-sm" />
              <ShadowDemo name="Default" className="shadow-ambient" />
              <ShadowDemo name="Medium" className="shadow-ambient-md" />
              <ShadowDemo name="Large" className="shadow-ambient-lg" />
            </div>
          </section>
        </main>
      )}

      {activeTab === 'login' && <LoginTemplate />}
      {activeTab === 'chat' && <ChatTemplate />}

      {/* Footer */}
      <footer className="bg-[var(--surface-container-low)] border-t border-[var(--outline-variant)] mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-center text-body-md text-[var(--on-surface-variant)]">
            Equatorial Minimalism Design System — Built for African Instant Messaging
          </p>
        </div>
      </footer>
    </div>
  );
};

// Helper Components
const ColorSwatch: React.FC<{ name: string; color: string; textColor: string }> = ({
  name,
  color,
  textColor,
}) => (
  <div className="rounded-lg overflow-hidden shadow-ambient-sm">
    <div className="h-20" style={{ backgroundColor: `var(${color.replace('var(', '').replace(')', '')})` }} />
    <div className="p-3 bg-[var(--surface-container-low)]">
      <p className="text-label-sm text-[var(--on-surface)]">{name}</p>
      <p className="text-label-sm text-[var(--on-surface-variant)] font-mono">{color}</p>
    </div>
  </div>
);

const ShadowDemo: React.FC<{ name: string; className: string }> = ({ name, className }) => (
  <div className={`bg-[var(--surface-container-low)] rounded-lg p-6 ${className}`}>
    <p className="text-label-md text-[var(--on-surface)] text-center">{name}</p>
  </div>
);

export default EquatorialMinimalismTheme;
