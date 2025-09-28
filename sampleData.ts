// Sample data service for offline demo mode
export const sampleData = {
  dashboard: {
    stats: {
      totalAlumni: 1247,
      activeJobs: 23,
      upcomingEvents: 8,
      totalDonations: 125000,
      activeMentorships: 45,
      unreadMessages: 3
    },
    recentActivity: [
      {
        user: "Sarah Johnson",
        message: "Posted a new job opportunity at Tech Corp",
        time: "2 hours ago"
      },
      {
        user: "Michael Chen", 
        message: "Started mentoring a new alumni",
        time: "4 hours ago"
      },
      {
        user: "Emily Rodriguez",
        message: "Created a networking event for next month",
        time: "1 day ago"
      },
      {
        user: "David Kim",
        message: "Updated his profile with new work experience",
        time: "1 day ago"
      },
      {
        user: "Jessica Taylor",
        message: "Donated to the scholarship fund",
        time: "2 days ago"
      }
    ],
    upcomingEvents: [
      {
        title: "Alumni Networking Mixer",
        location: "San Francisco",
        date: "February 15, 2024",
        type: "Networking"
      },
      {
        title: "Career Development Workshop",
        location: "Virtual",
        date: "February 20, 2024", 
        type: "Workshop"
      },
      {
        title: "Tech Industry Panel",
        location: "Seattle",
        date: "February 25, 2024",
        type: "Panel"
      }
    ]
  },

  alumni: [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      graduationYear: 2018,
      degree: 'Computer Science',
      currentRole: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      bio: 'Passionate about full-stack development and mentoring junior developers.',
      skills: ['JavaScript', 'React', 'Node.js', 'Python'],
      industries: ['Technology', 'Software'],
      isAvailableForMentoring: true,
      joinedDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      graduationYear: 2016,
      degree: 'Business Administration',
      currentRole: 'Product Manager',
      company: 'Innovation Inc',
      location: 'New York, NY',
      bio: 'Leading product strategy for fintech solutions.',
      skills: ['Product Management', 'Strategy', 'Analytics', 'Leadership'],
      industries: ['Finance', 'Technology'],
      isAvailableForMentoring: true,
      joinedDate: '2024-01-10'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      graduationYear: 2020,
      degree: 'Marketing',
      currentRole: 'Digital Marketing Manager',
      company: 'Creative Agency',
      location: 'Austin, TX',
      bio: 'Specializing in digital campaigns and brand strategy.',
      skills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics'],
      industries: ['Marketing', 'Advertising'],
      isAvailableForMentoring: false,
      joinedDate: '2024-01-20'
    },
    {
      id: '4',
      name: 'David Kim',
      email: 'david.kim@email.com',
      graduationYear: 2017,
      degree: 'Engineering',
      currentRole: 'Solutions Architect',
      company: 'Cloud Systems Inc',
      location: 'Seattle, WA',
      bio: 'Designing scalable cloud architectures for enterprise clients.',
      skills: ['AWS', 'Azure', 'DevOps', 'System Design'],
      industries: ['Technology', 'Cloud Computing'],
      isAvailableForMentoring: true,
      joinedDate: '2024-01-08'
    },
    {
      id: '5',
      name: 'Jessica Taylor',
      email: 'jessica.taylor@email.com',
      graduationYear: 2019,
      degree: 'Finance',
      currentRole: 'Investment Analyst',
      company: 'Capital Partners',
      location: 'Chicago, IL',
      bio: 'Focused on tech startup investments and market analysis.',
      skills: ['Financial Analysis', 'Investment Strategy', 'Due Diligence'],
      industries: ['Finance', 'Investment'],
      isAvailableForMentoring: true,
      joinedDate: '2024-01-12'
    }
  ],

  mentors: [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Senior Software Engineer',
      company: 'Tech Corp',
      expertise: ['JavaScript', 'React', 'Career Development', 'Leadership'],
      bio: 'I help junior developers grow their technical skills and navigate their careers.',
      rating: 4.9,
      totalSessions: 45,
      availability: 'Weekends',
      experienceYears: 8
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'Product Manager',
      company: 'Innovation Inc',
      expertise: ['Product Strategy', 'Analytics', 'Team Management'],
      bio: 'Product leader with experience scaling products from 0 to millions of users.',
      rating: 4.8,
      totalSessions: 32,
      availability: 'Evenings',
      experienceYears: 6
    },
    {
      id: '3',
      name: 'Dr. Jennifer Lee',
      role: 'Research Director',
      company: 'BioTech Solutions',
      expertise: ['Data Science', 'Machine Learning', 'Research'],
      bio: 'Research scientist passionate about mentoring the next generation of data scientists.',
      rating: 5.0,
      totalSessions: 28,
      availability: 'Flexible',
      experienceYears: 12
    }
  ],

  jobs: [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'full-time' as const,
      experience: 'senior' as const,
      salary: { min: 120000, max: 180000, currency: 'USD' },
      description: 'We are looking for a Senior Software Engineer to join our growing team. You will be responsible for designing and implementing scalable web applications.',
      requirements: [
        '5+ years of software development experience',
        'Strong proficiency in JavaScript and React',
        'Experience with Node.js and databases',
        'Excellent problem-solving skills'
      ],
      benefits: ['Health insurance', 'Dental coverage', '401k matching', 'Flexible PTO'],
      skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL'],
      postedDate: '2024-01-15',
      applicationDeadline: '2024-02-15',
      isRemote: false,
      postedBy: 'Sarah Johnson',
      applicationsCount: 24,
      viewsCount: 156
    },
    {
      id: '2',
      title: 'Product Manager',
      company: 'Innovation Labs',
      location: 'Remote',
      type: 'full-time' as const,
      experience: 'mid' as const,
      salary: { min: 90000, max: 130000, currency: 'USD' },
      description: 'Join our product team to drive the strategy and execution of our flagship products. You will work closely with engineering and design teams.',
      requirements: [
        '3+ years of product management experience',
        'Strong analytical and communication skills',
        'Experience with agile methodologies',
        'Technical background preferred'
      ],
      benefits: ['Remote work', 'Stock options', 'Learning budget', 'Health insurance'],
      skills: ['Product Strategy', 'Analytics', 'Agile', 'User Research'],
      postedDate: '2024-01-20',
      applicationDeadline: '2024-02-20',
      isRemote: true,
      postedBy: 'Michael Chen',
      applicationsCount: 18,
      viewsCount: 89
    }
  ],

  events: [
    {
      id: '1',
      title: 'Alumni Networking Mixer',
      description: 'Join fellow alumni for an evening of networking and reconnection.',
      date: '2024-02-15',
      time: '18:00',
      endTime: '21:00',
      location: 'Downtown Conference Center',
      isVirtual: false,
      type: 'networking' as const,
      category: 'Social',
      organizer: 'Alumni Relations Office',
      organizerEmail: 'alumni@university.edu',
      maxAttendees: 100,
      currentAttendees: 67,
      registrationDeadline: '2024-02-12',
      cost: 25,
      currency: 'USD',
      tags: ['networking', 'social', 'mixer'],
      isRegistered: false,
      isFeatured: true
    },
    {
      id: '2',
      title: 'Career Development Workshop',
      description: 'Learn advanced strategies for career growth and professional development.',
      date: '2024-02-20',
      time: '14:00',
      endTime: '17:00',
      location: 'Virtual Event',
      isVirtual: true,
      virtualLink: 'https://zoom.us/meeting/123',
      type: 'workshop' as const,
      category: 'Professional Development',
      organizer: 'Career Services',
      organizerEmail: 'careers@university.edu',
      maxAttendees: 50,
      currentAttendees: 32,
      registrationDeadline: '2024-02-18',
      cost: 0,
      currency: 'USD',
      tags: ['career', 'professional development', 'workshop'],
      isRegistered: true,
      isFeatured: false
    }
  ],

  campaigns: [
    {
      id: '1',
      title: 'Computer Science Scholarship Fund',
      description: 'Supporting deserving students pursuing degrees in computer science and related fields.',
      category: 'scholarship' as const,
      goalAmount: 50000,
      currentAmount: 32500,
      currency: 'USD',
      endDate: '2024-06-30',
      createdBy: 'CS Alumni Association',
      donorCount: 87,
      isActive: true,
      isFeatured: true,
      updates: [
        {
          id: '1',
          title: 'Halfway to our goal!',
          content: 'Thanks to your generous support, we\'ve reached 65% of our target. Every donation helps a student achieve their dreams.',
          date: '2024-01-20',
          author: 'Sarah Johnson'
        }
      ]
    },
    {
      id: '2',
      title: 'New Student Center Construction',
      description: 'Help build a modern student center that will serve future generations of students.',
      category: 'facilities' as const,
      goalAmount: 500000,
      currentAmount: 287000,
      currency: 'USD',
      endDate: '2024-12-31',
      createdBy: 'University Development Office',
      donorCount: 234,
      isActive: true,
      isFeatured: true,
      updates: []
    }
  ],

  conversations: [
    {
      id: '1',
      participants: [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          isOnline: true,
          lastSeen: '2024-01-28T10:30:00Z',
          role: 'Senior Software Engineer',
          company: 'Tech Corp'
        }
      ],
      lastMessage: {
        id: '1',
        conversationId: '1',
        senderId: '1',
        content: 'Thanks for connecting! Looking forward to our mentorship session.',
        timestamp: '2024-01-28T10:30:00Z',
        type: 'text' as const,
        status: 'read' as const
      },
      unreadCount: 0,
      type: 'direct' as const
    }
  ]
};

// Helper function to simulate API delay for realism
export const withDelay = (data: any, delay: number = 500): Promise<any> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), delay);
  });
};