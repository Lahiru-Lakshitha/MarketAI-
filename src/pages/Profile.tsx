import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ChangePasswordModal } from '@/components/ChangePasswordModal';
import {
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  FileText,
  Lock,
  Bell,
  Moon,
  Shield,
  LogOut,
  MapPin,
  Calendar,
} from 'lucide-react';

const industries = [
  'Technology',
  'E-commerce',
  'Healthcare',
  'Finance',
  'Education',
  'Real Estate',
  'Marketing & Advertising',
  'Media & Entertainment',
  'Travel & Hospitality',
  'Food & Beverage',
  'Other',
];

export default function Profile() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: '+1 (555) 123-4567',
    company: 'MarketAI Corp',
    industry: 'Marketing & Advertising',
    bio: 'Passionate about leveraging AI to transform digital marketing strategies and drive measurable results for brands.',
  });

  const [notifications, setNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: 'Profile Updated',
      description: 'Your profile changes have been saved successfully.',
    });
  };

  const handleLogoutAllDevices = () => {
    toast({
      title: 'Logged Out',
      description: 'You have been logged out from all devices.',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information and preferences
        </p>
      </div>

      {/* Profile Card */}
      <Card className="relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <CardContent className="relative p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar with Gradient Border */}
            <div className="relative">
              <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-br from-primary via-accent to-primary">
                <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary">
                    {formData.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 border-4 border-card" />
            </div>

            {/* User Info */}
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl font-bold text-foreground">{formData.fullName}</h2>
              <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                <Briefcase className="w-3.5 h-3.5" />
                AI Marketing Specialist
              </span>
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{formData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Member since Jan 2024</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details Form */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <User className="w-5 h-5 text-primary" />
            Profile Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2 text-foreground">
                <User className="w-4 h-4 text-muted-foreground" />
                Full Name
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-foreground">
                <Mail className="w-4 h-4 text-muted-foreground" />
                Email Address
              </Label>
              <Input
                id="email"
                value={formData.email}
                readOnly
                className="bg-muted/50 cursor-not-allowed"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2 text-foreground">
                <Phone className="w-4 h-4 text-muted-foreground" />
                Phone Number
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Company */}
            <div className="space-y-2">
              <Label htmlFor="company" className="flex items-center gap-2 text-foreground">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                Company / Brand Name
              </Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Your company name"
              />
            </div>

            {/* Industry */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="industry" className="flex items-center gap-2 text-foreground">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                Industry
              </Label>
              <Select
                value={formData.industry}
                onValueChange={(value) => handleInputChange('industry', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bio */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio" className="flex items-center gap-2 text-foreground">
                <FileText className="w-4 h-4 text-muted-foreground" />
                Short Bio
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full sm:w-auto gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Lock className="w-5 h-5 text-primary" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Change Password */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Password</p>
                <p className="text-sm text-muted-foreground">Update your password</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsPasswordModalOpen(true)}>
              Change Password
            </Button>
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates and alerts</p>
              </div>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Moon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Toggle dark theme</p>
              </div>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Shield className="w-5 h-5 text-primary" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Security Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground">Last Login</p>
              <p className="font-medium text-foreground mt-1">Today at 10:42 AM</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground">Active Sessions</p>
              <p className="font-medium text-foreground mt-1">2 devices</p>
            </div>
          </div>

          {/* Logout All Devices */}
          <Button
            variant="outline"
            onClick={handleLogoutAllDevices}
            className="w-full sm:w-auto text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout from All Devices
          </Button>
        </CardContent>
      </Card>

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={isPasswordModalOpen}
        onOpenChange={setIsPasswordModalOpen}
      />
    </div>
  );
}
