# Frontend Component Structure - Bio-Link Management System

## Overview

This document outlines the comprehensive frontend component architecture for the bio-link management application, including all UI components, their relationships, and implementation details.

## Component Hierarchy

```
app/
├── (dashboard)/                    # Dashboard layout group
│   ├── layout.tsx                 # Dashboard layout wrapper
│   ├── page.tsx                   # Dashboard home
│   └── bio-pages/
│       ├── page.tsx               # Bio pages list
│       ├── [id]/
│       │   ├── page.tsx           # Bio page editor
│       │   ├── analytics/
│       │   │   └── page.tsx       # Analytics dashboard
│       │   └── settings/
│       │       └── page.tsx       # Bio page settings
├── (public)/
│   └── [slug]/
│       └── page.tsx               # Public bio page view
└── (auth)/
    ├── login/
    │   └── page.tsx
    └── register/
        └── page.tsx

components/
├── ui/                            # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── select.tsx
│   ├── slider.tsx
│   ├── color-picker.tsx
│   ├── date-range-picker.tsx
│   └── ...
├── layout/
│   ├── dashboard-layout.tsx       # Main dashboard layout
│   ├── sidebar.tsx                # Navigation sidebar
│   ├── header.tsx                 # Top header bar
│   └── mobile-nav.tsx             # Mobile navigation
├── bio-pages/
│   ├── bio-page-list.tsx          # List of bio pages
│   ├── bio-page-card.tsx          # Single bio page card
│   ├── bio-page-editor.tsx        # Main editor component
│   ├── bio-page-preview.tsx       # Live preview component
│   ├── bio-page-settings.tsx      # Settings panel
│   └── bio-page-header.tsx        # Editor header
├── bio-links/
│   ├── link-list.tsx              # List of links
│   ├── link-item.tsx              # Single link item
│   ├── link-editor.tsx            # Link editing dialog
│   ├── link-form.tsx              # Link creation/edit form
│   ├── link-draggable.tsx         # Draggable link wrapper
│   └── link-preview.tsx           # Link preview component
├── theme/
│   ├── theme-provider.tsx         # Theme context provider
│   ├── theme-editor.tsx           # Theme configuration editor
│   ├── theme-preset-selector.tsx  # Preset selection component
│   ├── theme-preview.tsx          # Theme preview card
│   ├── color-picker.tsx           # Color selection component
│   ├── font-selector.tsx          # Font family selector
│   ├── slider-control.tsx         # Slider for numeric values
│   ├── select-control.tsx         # Select dropdown
│   └── live-preview.tsx           # Live preview wrapper
├── analytics/
│   ├── analytics-dashboard.tsx     # Main analytics dashboard
│   ├── analytics-overview.tsx      # Overview metrics cards
│   ├── click-trend-chart.tsx      # Click trend visualization
│   ├── device-breakdown.tsx       # Device type distribution
│   ├── top-links.tsx              # Top performing links
│   ├── geographic-distribution.tsx # Geographic map/chart
│   ├── referrer-list.tsx          # Top referrers list
│   ├── real-time-counter.tsx      # Real-time click counter
│   └── date-range-picker.tsx      # Date range selector
├── forms/
│   ├── bio-page-form.tsx          # Bio page creation/edit form
│   ├── link-form.tsx              # Link creation/edit form
│   ├── theme-preset-form.tsx      # Theme preset form
│   └── validation/
│       ├── form-error.tsx         # Error message display
│       └── form-hint.tsx          # Help text display
├── shared/
│   ├── avatar-uploader.tsx        # Avatar upload component
│   ├── image-uploader.tsx         # General image upload
│   ├── icon-selector.tsx          # Icon selection component
│   ├── url-input.tsx              # URL input with validation
│   ├── slug-input.tsx             # Slug input with auto-generation
│   └── rich-text-editor.tsx       # Rich text editor for descriptions
├── feedback/
│   ├── toast.tsx                  # Toast notifications
│   ├── loading-spinner.tsx        # Loading indicator
│   ├── empty-state.tsx            # Empty state display
│   ├── error-boundary.tsx         # Error boundary component
│   └── confirmation-dialog.tsx    # Confirmation dialog
└── public/
    ├── public-bio-page.tsx        # Public bio page display
    ├── public-link.tsx            # Public link button
    ├── public-avatar.tsx           # Public avatar display
    └── social-share.tsx           # Social share buttons
```

## Core Components

### 1. Dashboard Layout

#### DashboardLayout

Main layout wrapper for dashboard pages.

```typescript
// components/layout/dashboard-layout.tsx
import * as React from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { MobileNav } from './mobile-nav';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="dashboard-layout">
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="dashboard-main">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="dashboard-content">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
```

#### Sidebar

Navigation sidebar with menu items.

```typescript
// components/layout/sidebar.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Link as LinkIcon,
  Palette,
  BarChart3,
  Settings,
  Users,
  CreditCard
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const menuItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/bio-pages', icon: LinkIcon, label: 'Bio Pages' },
  { href: '/dashboard/themes', icon: Palette, label: 'Themes' },
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({ open, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn('sidebar', open && 'sidebar-open')}>
      <div className="sidebar-header">
        <h1>BioLink Pro</h1>
        <button onClick={onToggle} className="sidebar-toggle">
          <LayoutDashboard />
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn('sidebar-link', isActive && 'sidebar-link-active')}
            >
              <Icon />
              {open && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <Link href="/dashboard/organization" className="sidebar-link">
          <Users />
          {open && <span>Organization</span>}
        </Link>
        <Link href="/dashboard/billing" className="sidebar-link">
          <CreditCard />
          {open && <span>Billing</span>}
        </Link>
      </div>
    </aside>
  );
}
```

### 2. Bio Pages Components

#### BioPageList

List view of all bio pages with filtering and search.

```typescript
// components/bio-pages/bio-page-list.tsx
'use client';

import * as React from 'react';
import { BioPageCard } from './bio-page-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Plus, Search, Filter } from 'lucide-react';
import { useBioPages } from '@/hooks/use-bio-pages';

export function BioPageList() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'active' | 'inactive'>('all');
  const { bioPages, loading, error } = useBioPages();

  const filteredPages = React.useMemo(() => {
    return bioPages.filter((page) => {
      const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          page.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' ||
                           (filterStatus === 'active' && page.isActive) ||
                           (filterStatus === 'inactive' && !page.isActive);
      return matchesSearch && matchesFilter;
    });
  }, [bioPages, searchQuery, filterStatus]);

  if (loading) {
    return <div className="loading-state">Loading bio pages...</div>;
  }

  if (error) {
    return <div className="error-state">Error loading bio pages: {error.message}</div>;
  }

  return (
    <div className="bio-page-list">
      <div className="list-header">
        <div className="header-left">
          <h1>My Bio Pages</h1>
          <p className="text-muted-foreground">
            {filteredPages.length} page{filteredPages.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button>
          <Plus />
          Create New Page
        </Button>
      </div>

      <div className="list-filters">
        <div className="search-box">
          <Search />
          <Input
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger>
            <Filter />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Pages</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="pages-grid">
        {filteredPages.map((page) => (
          <BioPageCard key={page.id} bioPage={page} />
        ))}
      </div>

      {filteredPages.length === 0 && (
        <div className="empty-state">
          <p>No bio pages found</p>
          <Button variant="outline" onClick={() => setSearchQuery('')}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
```

#### BioPageCard

Card component displaying a single bio page.

```typescript
// components/bio-pages/bio-page-card.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  MoreVertical,
  Eye,
  EyeOff,
  BarChart2,
  ExternalLink,
  Copy
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BioPage } from '@/types/bio-page';

interface BioPageCardProps {
  bioPage: BioPage;
}

export function BioPageCard({ bioPage }: BioPageCardProps) {
  const [copied, setCopied] = React.useState(false);

  async function handleCopyLink() {
    const url = `${window.location.origin}/p/${bioPage.slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="bio-page-card">
      <div className="card-header">
        <div className="page-info">
          {bioPage.avatarUrl && (
            <img src={bioPage.avatarUrl} alt="" className="page-avatar" />
          )}
          <div>
            <h3 className="page-title">{bioPage.title}</h3>
            <p className="page-slug">/{bioPage.slug}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/bio-pages/${bioPage.id}`}>
                <BarChart2 />
                View Analytics
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/bio-pages/${bioPage.id}/edit`}>
                <Edit />
                Edit Page
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyLink}>
              <Copy />
              {copied ? 'Copied!' : 'Copy Link'}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={`/p/${bioPage.slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink />
                View Live Page
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              {bioPage.isActive ? (
                <>
                  <EyeOff />
                  Deactivate
                </>
              ) : (
                <>
                  <Eye />
                  Activate
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="card-body">
        {bioPage.description && (
          <p className="page-description">{bioPage.description}</p>
        )}

        <div className="page-stats">
          <div className="stat">
            <span className="stat-value">{bioPage.linksCount}</span>
            <span className="stat-label">Links</span>
          </div>
          <div className="stat">
            <span className="stat-value">{bioPage.totalClicks}</span>
            <span className="stat-label">Clicks</span>
          </div>
          <div className="stat">
            <span className={`stat-value ${bioPage.isActive ? 'active' : 'inactive'}`}>
              {bioPage.isActive ? 'Active' : 'Inactive'}
            </span>
            <span className="stat-label">Status</span>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <Button variant="outline" asChild className="flex-1">
          <Link href={`/dashboard/bio-pages/${bioPage.id}/edit`}>
            Edit
          </Link>
        </Button>
        <Button asChild className="flex-1">
          <Link href={`/p/${bioPage.slug}`} target="_blank" rel="noopener noreferrer">
            View
          </Link>
        </Button>
      </div>
    </Card>
  );
}
```

#### BioPageEditor

Main editor component for editing bio pages.

```typescript
// components/bio-pages/bio-page-editor.tsx
'use client';

import * as React from 'react';
import { BioPageHeader } from './bio-page-header';
import { LinkList } from '../bio-links/link-list';
import { ThemeEditor } from '../theme/theme-editor';
import { LivePreview } from '../theme/live-preview';
import { useBioPage } from '@/hooks/use-bio-page';

interface BioPageEditorProps {
  bioPageId: string;
}

export function BioPageEditor({ bioPageId }: BioPageEditorProps) {
  const { bioPage, loading, error } = useBioPage(bioPageId);
  const [activeTab, setActiveTab] = React.useState<'links' | 'theme' | 'settings'>('links');

  if (loading) {
    return <div className="loading-state">Loading bio page...</div>;
  }

  if (error) {
    return <div className="error-state">Error loading bio page: {error.message}</div>;
  }

  return (
    <div className="bio-page-editor">
      <BioPageHeader
        bioPage={bioPage}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="editor-content">
        <div className="editor-main">
          {activeTab === 'links' && (
            <LinkList bioPageId={bioPageId} />
          )}
          {activeTab === 'theme' && (
            <ThemeEditor />
          )}
          {activeTab === 'settings' && (
            <BioPageSettings bioPage={bioPage} />
          )}
        </div>

        <div className="editor-preview">
          <LivePreview bioPage={bioPage} />
        </div>
      </div>
    </div>
  );
}
```

### 3. Bio Links Components

#### LinkList

List of links with drag-and-drop reordering.

```typescript
// components/bio-links/link-list.tsx
'use client';

import * as React from 'react';
import { LinkItem } from './link-item';
import { Button } from '@/components/ui/button';
import { Plus, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useBioLinks } from '@/hooks/use-bio-links';

interface LinkListProps {
  bioPageId: string;
}

export function LinkList({ bioPageId }: LinkListProps) {
  const { links, loading, reorderLinks } = useBioLinks(bioPageId);
  const [dragging, setDragging] = React.useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;
    setDragging(false);

    if (active.id !== over?.id) {
      const oldIndex = links.findIndex((link) => link.id === active.id);
      const newIndex = links.findIndex((link) => link.id === over.id);
      const reorderedLinks = arrayMove(links, oldIndex, newIndex);
      reorderLinks(reorderedLinks);
    }
  }

  if (loading) {
    return <div className="loading-state">Loading links...</div>;
  }

  return (
    <div className="link-list">
      <div className="list-header">
        <h2>Links</h2>
        <Button>
          <Plus />
          Add Link
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={() => setDragging(true)}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={links.map((l) => l.id)}
          strategy={verticalListSortingStrategy}
        >
          {links.map((link) => (
            <LinkItem key={link.id} link={link} />
          ))}
        </SortableContext>
      </DndContext>

      {links.length === 0 && (
        <div className="empty-state">
          <GripVertical />
          <p>No links yet. Add your first link to get started!</p>
          <Button>
            <Plus />
            Add Link
          </Button>
        </div>
      )}
    </div>
  );
}
```

#### LinkItem

Single link item with edit/delete controls.

```typescript
// components/bio-links/link-item.tsx
'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  GripVertical
} from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BioLink } from '@/types/bio-link';

interface LinkItemProps {
  link: BioLink;
}

export function LinkItem({ link }: LinkItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card ref={setNodeRef} style={style} className="link-item">
      <div className="link-header" {...attributes} {...listeners}>
        <GripVertical />
        <div className="link-info">
          <h3 className="link-title">{link.title}</h3>
          <p className="link-url">{link.url}</p>
        </div>
        <div className="link-actions">
          <Switch
            checked={link.isActive}
            onCheckedChange={(checked) => handleToggleVisibility(link.id, checked)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(link.id)}>
                <Edit />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink />
                  Open Link
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleToggleVisibility(link.id, !link.isActive)}>
                {link.isActive ? <EyeOff /> : <Eye />}
                {link.isActive ? 'Hide' : 'Show'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(link.id)}>
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {link.description && (
        <p className="link-description">{link.description}</p>
      )}

      <div className="link-stats">
        <span className="clicks">{link.clicksCount} clicks</span>
      </div>
    </Card>
  );
}

function handleToggleVisibility(linkId: string, isActive: boolean) {
  // Implement toggle visibility
}

function handleEdit(linkId: string) {
  // Open edit dialog
}

function handleDelete(linkId: string) {
  // Show confirmation dialog and delete
}
```

#### LinkForm

Form for creating/editing links.

```typescript
// components/bio-links/link-form.tsx
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { IconSelector } from '../shared/icon-selector';
import { ImageUploader } from '../shared/image-uploader';
import { bioLinkSchema } from '@/lib/validations/bio-link';

interface LinkFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: z.infer<typeof bioLinkSchema>) => void;
  initialData?: z.infer<typeof bioLinkSchema>;
}

export function LinkForm({ open, onClose, onSubmit, initialData }: LinkFormProps) {
  const form = useForm<z.infer<typeof bioLinkSchema>>({
    resolver: zodResolver(bioLinkSchema),
    defaultValues: initialData || {
      title: '',
      url: '',
      description: '',
      iconUrl: '',
      imageUrl: '',
      isActive: true,
      order: 0,
    },
  });

  async function handleSubmit(data: z.infer<typeof bioLinkSchema>) {
    try {
      await onSubmit(data);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Failed to save link:', error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="link-form">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Link' : 'Add New Link'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="form-content">
          <div className="form-field">
            <label htmlFor="title">Title *</label>
            <Input
              id="title"
              {...form.register('title')}
              placeholder="e.g., Twitter"
            />
            {form.formState.errors.title && (
              <p className="error-message">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="url">URL *</label>
            <Input
              id="url"
              {...form.register('url')}
              placeholder="https://twitter.com/username"
            />
            {form.formState.errors.url && (
              <p className="error-message">{form.formState.errors.url.message}</p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="description">Description</label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Brief description of the link"
              rows={3}
            />
          </div>

          <div className="form-field">
            <label>Icon</label>
            <IconSelector
              value={form.watch('iconUrl')}
              onChange={(iconUrl) => form.setValue('iconUrl', iconUrl)}
            />
          </div>

          <div className="form-field">
            <label>Cover Image</label>
            <ImageUploader
              value={form.watch('imageUrl')}
              onChange={(imageUrl) => form.setValue('imageUrl', imageUrl)}
            />
          </div>

          <div className="form-field">
            <div className="switch-wrapper">
              <Switch
                id="isActive"
                checked={form.watch('isActive')}
                onCheckedChange={(checked) => form.setValue('isActive', checked)}
              />
              <label htmlFor="isActive">Active</label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update' : 'Create'} Link
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### 4. Theme Components

#### ThemeEditor

Main theme configuration editor.

```typescript
// components/theme/theme-editor.tsx
'use client';

import * as React from 'react';
import { useTheme } from './theme-provider';
import { ColorPicker } from './color-picker';
import { FontSelector } from './font-selector';
import { SliderControl } from './slider-control';
import { SelectControl } from './select-control';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ThemeEditor() {
  const { theme, updateTheme } = useTheme();

  return (
    <div className="theme-editor">
      <div className="editor-header">
        <h2>Theme Settings</h2>
        <p className="text-muted-foreground">
          Customize the appearance of your bio page
        </p>
      </div>

      <Tabs defaultValue="colors" className="theme-tabs">
        <TabsList>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="background">Background</TabsTrigger>
        </TabsList>

        <TabsContent value="colors">
          <Card className="theme-section">
            <h3>Color Palette</h3>
            <div className="color-grid">
              <ColorPicker
                label="Primary Color"
                value={theme.primaryColor}
                onChange={(color) => updateTheme({ primaryColor: color })}
              />
              <ColorPicker
                label="Secondary Color"
                value={theme.secondaryColor}
                onChange={(color) => updateTheme({ secondaryColor: color })}
              />
              <ColorPicker
                label="Background Color"
                value={theme.backgroundColor}
                onChange={(color) => updateTheme({ backgroundColor: color })}
              />
              <ColorPicker
                label="Text Color"
                value={theme.textColor}
                onChange={(color) => updateTheme({ textColor: color })}
              />
              <ColorPicker
                label="Secondary Text Color"
                value={theme.secondaryTextColor}
                onChange={(color) => updateTheme({ secondaryTextColor: color })}
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="typography">
          <Card className="theme-section">
            <h3>Typography</h3>
            <div className="typography-controls">
              <FontSelector
                label="Font Family"
                value={theme.fontFamily}
                onChange={(font) => updateTheme({ fontFamily: font })}
              />
              <SliderControl
                label="Base Font Size"
                value={parseInt(theme.fontSize.base)}
                min={12}
                max={24}
                onChange={(size) => updateTheme({
                  fontSize: { ...theme.fontSize, base: `${size}px` }
                })}
              />
              <SliderControl
                label="Heading Font Size"
                value={parseInt(theme.fontSize.heading)}
                min={18}
                max={48}
                onChange={(size) => updateTheme({
                  fontSize: { ...theme.fontSize, heading: `${size}px` }
                })}
              />
              <SelectControl
                label="Font Weight"
                value={theme.fontWeight.normal.toString()}
                options={[
                  { value: '300', label: 'Light' },
                  { value: '400', label: 'Normal' },
                  { value: '500', label: 'Medium' },
                  { value: '600', label: 'Semi Bold' },
                  { value: '700', label: 'Bold' },
                ]}
                onChange={(weight) => updateTheme({
                  fontWeight: { ...theme.fontWeight, normal: parseInt(weight) }
                })}
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="layout">
          <Card className="theme-section">
            <h3>Layout</h3>
            <div className="layout-controls">
              <SelectControl
                label="Layout Style"
                value={theme.layout}
                options={[
                  { value: 'vertical', label: 'Vertical' },
                  { value: 'grid', label: 'Grid' },
                ]}
                onChange={(layout) => updateTheme({ layout })}
              />
              <SelectControl
                label="Alignment"
                value={theme.alignment}
                options={[
                  { value: 'left', label: 'Left' },
                  { value: 'center', label: 'Center' },
                  { value: 'right', label: 'Right' },
                ]}
                onChange={(alignment) => updateTheme({ alignment })}
              />
              <SelectControl
                label="Spacing"
                value={theme.spacing}
                options={[
                  { value: 'compact', label: 'Compact' },
                  { value: 'normal', label: 'Normal' },
                  { value: 'relaxed', label: 'Relaxed' },
                ]}
                onChange={(spacing) => updateTheme({ spacing })}
              />
              <SliderControl
                label="Max Width"
                value={parseInt(theme.maxWidth)}
                min={300}
                max={800}
                onChange={(width) => updateTheme({ maxWidth: `${width}px` })}
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="buttons">
          <Card className="theme-section">
            <h3>Button Style</h3>
            <div className="button-controls">
              <SelectControl
                label="Button Style"
                value={theme.buttonStyle}
                options={[
                  { value: 'solid', label: 'Solid' },
                  { value: 'outline', label: 'Outline' },
                  { value: 'ghost', label: 'Ghost' },
                ]}
                onChange={(buttonStyle) => updateTheme({ buttonStyle })}
              />
              <SliderControl
                label="Border Radius"
                value={theme.borderRadius}
                min={0}
                max={50}
                onChange={(radius) => updateTheme({ borderRadius: radius })}
              />
              <SliderControl
                label="Border Width"
                value={theme.borderWidth}
                min={0}
                max={10}
                onChange={(width) => updateTheme({ borderWidth: width })}
              />
              <SelectControl
                label="Shadow"
                value={theme.shadow}
                options={[
                  { value: 'none', label: 'None' },
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' },
                ]}
                onChange={(shadow) => updateTheme({ shadow })}
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="background">
          <Card className="theme-section">
            <h3>Background</h3>
            <div className="background-controls">
              <SelectControl
                label="Background Type"
                value={theme.backgroundType}
                options={[
                  { value: 'solid', label: 'Solid Color' },
                  { value: 'gradient', label: 'Gradient' },
                  { value: 'image', label: 'Image' },
                ]}
                onChange={(backgroundType) => updateTheme({ backgroundType })}
              />

              {theme.backgroundType === 'gradient' && (
                <>
                  <SelectControl
                    label="Gradient Type"
                    value={theme.backgroundGradient?.type || 'linear'}
                    options={[
                      { value: 'linear', label: 'Linear' },
                      { value: 'radial', label: 'Radial' },
                    ]}
                    onChange={(type) => updateTheme({
                      backgroundGradient: { ...theme.backgroundGradient, type }
                    })}
                  />
                  <div className="gradient-colors">
                    {theme.backgroundGradient?.colors.map((color, index) => (
                      <ColorPicker
                        key={index}
                        label={`Color ${index + 1}`}
                        value={color}
                        onChange={(newColor) => {
                          const newColors = [...theme.backgroundGradient!.colors];
                          newColors[index] = newColor;
                          updateTheme({
                            backgroundGradient: {
                              ...theme.backgroundGradient!,
                              colors: newColors
                            }
                          });
                        }}
                      />
                    ))}
                  </div>
                </>
              )}

              {theme.backgroundType === 'image' && (
                <ImageUploader
                  label="Background Image"
                  value={theme.backgroundImage?.url || ''}
                  onChange={(url) => updateTheme({
                    backgroundImage: { ...theme.backgroundImage, url }
                  })}
                />
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

#### LivePreview

Live preview of the bio page with applied theme.

```typescript
// components/theme/live-preview.tsx
'use client';

import * as React from 'react';
import { useTheme } from './theme-provider';
import { generateThemeCSS } from '@/lib/theme/css-generator';

interface LivePreviewProps {
  bioPage: {
    title: string;
    description: string;
    avatarUrl: string;
    links: Array<{
      title: string;
      url: string;
      description?: string;
      iconUrl?: string;
      imageUrl?: string;
    }>;
  };
}

export function LivePreview({ bioPage }: LivePreviewProps) {
  const { theme } = useTheme();
  const themeCSS = generateThemeCSS(theme);

  return (
    <div className="live-preview-container">
      <div className="preview-header">
        <h3>Live Preview</h3>
        <p className="text-muted-foreground">
          See your changes in real-time
        </p>
      </div>

      <div className="preview-frame">
        <style>{themeCSS}</style>
        <div className="bio-page-preview">
          {bioPage.avatarUrl && (
            <img
              src={bioPage.avatarUrl}
              alt={bioPage.title}
              className="bio-avatar"
            />
          )}

          <h1 className="bio-title">{bioPage.title}</h1>

          {bioPage.description && (
            <p className="bio-description">{bioPage.description}</p>
          )}

          <div className="bio-links">
            {bioPage.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                className="bio-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.imageUrl && (
                  <img src={link.imageUrl} alt="" className="link-image" />
                )}
                <div className="link-content">
                  {link.iconUrl && (
                    <img src={link.iconUrl} alt="" className="link-icon" />
                  )}
                  <div>
                    <span className="link-title">{link.title}</span>
                    {link.description && (
                      <span className="link-description">{link.description}</span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 5. Analytics Components

#### AnalyticsDashboard

Main analytics dashboard component.

```typescript
// components/analytics/analytics-dashboard.tsx
'use client';

import * as React from 'react';
import { AnalyticsOverview } from './analytics-overview';
import { ClickTrendChart } from './click-trend-chart';
import { DeviceBreakdown } from './device-breakdown';
import { TopLinks } from './top-links';
import { GeographicDistribution } from './geographic-distribution';
import { DateRangePicker } from './date-range-picker';
import { Card } from '@/components/ui/card';
import { useAnalytics } from '@/hooks/use-analytics';

interface AnalyticsDashboardProps {
  bioPageId: string;
}

export function AnalyticsDashboard({ bioPageId }: AnalyticsDashboardProps) {
  const [dateRange, setDateRange] = React.useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  });
  const { analytics, loading, error } = useAnalytics(bioPageId, dateRange);

  if (loading) {
    return <div className="loading-state">Loading analytics...</div>;
  }

  if (error) {
    return <div className="error-state">Error loading analytics: {error.message}</div>;
  }

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Analytics</h1>
          <p className="text-muted-foreground">
            Track your bio page performance
          </p>
        </div>
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
        />
      </div>

      <AnalyticsOverview
        totalClicks={analytics.totalClicks}
        uniqueClicks={analytics.uniqueClicks}
        dateRange={dateRange}
      />

      <div className="dashboard-grid">
        <ClickTrendChart timeline={analytics.timeline} />
        <DeviceBreakdown data={analytics.deviceBreakdown} />
      </div>

      <div className="dashboard-grid">
        <TopLinks links={analytics.topLinks} />
        <GeographicDistribution countries={analytics.topCountries} />
      </div>
    </div>
  );
}
```

## Custom Hooks

### useBioPages

Hook for fetching and managing bio pages.

```typescript
// hooks/use-bio-pages.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bioPages } from '@/lib/db/schema';
import { db } from '@/lib/db';

export function useBioPages() {
  const queryClient = useQueryClient();

  const {
    data: bioPages,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['bio-pages'],
    queryFn: async () => {
      const pages = await db.query.bioPages.findMany({
        orderBy: [desc(bioPages.createdAt)],
      });
      return pages;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateBioPageInput) => {
      const [page] = await db.insert(bioPages).values(data).returning();
      return page;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bio-pages'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateBioPageInput;
    }) => {
      const [page] = await db
        .update(bioPages)
        .set(data)
        .where(eq(bioPages.id, id))
        .returning();
      return page;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bio-pages'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await db.delete(bioPages).where(eq(bioPages.id, id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bio-pages'] });
    },
  });

  return {
    bioPages: bioPages || [],
    loading: isLoading,
    error,
    createPage: createMutation.mutateAsync,
    updatePage: updateMutation.mutateAsync,
    deletePage: deleteMutation.mutateAsync,
  };
}
```

### useBioLinks

Hook for fetching and managing bio links.

```typescript
// hooks/use-bio-links.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bioLinks } from '@/lib/db/schema';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';

export function useBioLinks(bioPageId: string) {
  const queryClient = useQueryClient();

  const {
    data: links,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['bio-links', bioPageId],
    queryFn: async () => {
      const pageLinks = await db.query.bioLinks.findMany({
        where: eq(bioLinks.bioPageId, bioPageId),
        orderBy: [bioLinks.order],
      });
      return pageLinks;
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (reorderedLinks: BioLink[]) => {
      await Promise.all(
        reorderedLinks.map((link, index) =>
          db
            .update(bioLinks)
            .set({ order: index })
            .where(eq(bioLinks.id, link.id))
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bio-links', bioPageId] });
    },
  });

  return {
    links: links || [],
    loading: isLoading,
    error,
    reorderLinks: reorderMutation.mutateAsync,
  };
}
```

### useAnalytics

Hook for fetching analytics data.

```typescript
// hooks/use-analytics.ts
import { useQuery } from '@tanstack/react-query';

interface AnalyticsData {
  totalClicks: number;
  uniqueClicks: number;
  topLinks: Array<{
    id: string;
    title: string;
    clicks: number;
    percentage: number;
  }>;
  deviceBreakdown: { desktop: number; mobile: number; tablet: number };
  topCountries: Record<string, number>;
  timeline: Array<{ date: string; clicks: number }>;
}

export function useAnalytics(
  bioPageId: string,
  dateRange: { startDate: Date; endDate: Date }
) {
  const {
    data: analytics,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['analytics', bioPageId, dateRange],
    queryFn: async (): Promise<AnalyticsData> => {
      const params = new URLSearchParams({
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
      });

      const response = await fetch(
        `/api/v1/bio-pages/${bioPageId}/analytics?${params}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      const data = await response.json();
      return data.data;
    },
  });

  return {
    analytics,
    loading: isLoading,
    error,
  };
}
```

## Utility Components

### ColorPicker

Color selection component with preset colors and custom picker.

```typescript
// components/theme/color-picker.tsx
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const presetColors = [
  '#000000', '#ffffff', '#ef4444', '#f97316', '#f59e0b',
  '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#6366f1',
  '#8b5cf6', '#d946ef', '#f43f5e', '#78716c', '#1f2937',
];

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const [customColor, setCustomColor] = React.useState(value);

  function handleColorChange(color: string) {
    onChange(color);
    setCustomColor(color);
  }

  return (
    <div className="color-picker">
      <label>{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="color-trigger">
            <div
              className="color-preview"
              style={{ backgroundColor: value }}
            />
            <span>{value}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="color-popover">
          <div className="preset-colors">
            {presetColors.map((color) => (
              <button
                key={color}
                className={`color-swatch ${value === color ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
              />
            ))}
          </div>
          <div className="custom-color">
            <label>Custom Color</label>
            <input
              type="color"
              value={customColor}
              onChange={(e) => handleColorChange(e.target.value)}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
```

## Responsive Design

All components should be fully responsive with the following breakpoints:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

Use Tailwind CSS responsive classes:

- `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- `flex-col md:flex-row`
- `hidden md:block`

## Accessibility

All components must follow WCAG 2.1 AA guidelines:

- Proper ARIA labels
- Keyboard navigation support
- Focus management
- Color contrast ratios
- Screen reader support

## Performance Optimization

1. **Code Splitting**: Use dynamic imports for large components
2. **Lazy Loading**: Load images and components on demand
3. **Memoization**: Use React.memo for expensive components
4. **Virtualization**: Use react-window for long lists
5. **Debouncing**: Debounce search and filter inputs
6. **Caching**: Use React Query for data caching
7. **Optimization**: Optimize images and assets

## State Management

Use React Query for server state and React Context for client state:

- **Server State**: Bio pages, links, analytics (React Query)
- **Client State**: Theme, UI state, form state (React Context/useState)
- **Form State**: Form validation and submission (react-hook-form)
