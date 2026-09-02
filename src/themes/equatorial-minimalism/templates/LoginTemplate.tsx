import React from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';

export const LoginTemplate: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-4 bg-[var(--primary)] rounded-xl flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--on-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-headline-lg text-[var(--primary)] mb-2">Welcome Back</h1>
          <p className="text-body-md text-[var(--on-surface-variant)]">Sign in to continue your conversation</p>
        </div>

        {/* Login Form */}
        <Card padding="lg" shadow="lg">
          <form className="space-y-6">
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+234 800 000 0000"
              helperText="We'll send you a verification code"
            />
            
            <Button variant="primary" size="lg" className="w-full">
              Continue
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--outline-variant)]">
            <p className="text-center text-body-md text-[var(--on-surface-variant)] mb-4">
              Or continue with
            </p>
            <div className="flex gap-3">
              <Button variant="outline" size="md" className="flex-1">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button variant="outline" size="md" className="flex-1">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.684.816-1.813 1.508-2.987 1.508-1.18 0-2.04-.692-2.04-1.835 0-1.14.493-2.27 1.177-3.08.684-.816 1.813-1.508 2.987-1.508 1.18 0 2.04.692 2.04 1.835zm4.86 16.57c-.123.556-.684.93-1.232.93-.37 0-.616-.123-.863-.37-.37-.37-.37-1.108-.123-1.787.247-.678.74-1.232 1.355-1.232.37 0 .616.123.863.37.493.493.493 1.355 0 2.09zm-3.45-6.77c-1.355-.493-2.834-.74-4.313-.74-3.08 0-5.796 1.355-7.643 3.572-.74.925-1.232 1.97-1.478 3.08-.123.556-.062 1.108.185 1.602.37.74 1.108 1.232 1.97 1.232.616 0 1.232-.247 1.663-.678.308-.308.493-.74.616-1.232.123-.37.308-.74.555-1.047 1.048-1.355 2.71-2.157 4.436-2.157.74 0 1.478.123 2.157.37.678.247 1.355.616 1.97 1.108.925.74 1.663 1.663 2.157 2.834.247.555.37 1.17.37 1.785 0 .616-.123 1.232-.37 1.787-.247.555-.616 1.047-1.047 1.478-.432.432-.925.74-1.478.925-.555.185-1.17.308-1.787.308-.616 0-1.232-.123-1.785-.37-.555-.247-1.047-.616-1.478-1.047-.432-.432-.74-.925-.925-1.478-.185-.555-.308-1.17-.308-1.787 0-.616.123-1.232.37-1.787.247-.555.616-1.047 1.047-1.478.432-.432.925-.74 1.478-.925.555-.185 1.17-.308 1.787-.308.616 0 1.232.123 1.785.37.555.247 1.047.616 1.478 1.047.432.432.74.925.925 1.478.185.555.308 1.17.308 1.787 0 .616-.123 1.232-.37 1.787-.247.555-.616 1.047-1.047 1.478-.432.432-.925.74-1.478.925-.555.185-1.17.308-1.787.308z"/>
                </svg>
                Apple
              </Button>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center mt-8 text-body-md text-[var(--on-surface-variant)]">
          Don't have an account?{' '}
          <a href="#" className="text-[var(--secondary)] font-semibold hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};
