import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { campusInfo } from '@/data/students';
import Layout from '@/components/Layout';

const InfoPage: React.FC = () => {
  return (
    <Layout>
      <div className="p-4 space-y-6 pb-20">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-1">Campus Info</h2>
          <p className="text-muted-foreground text-sm">
            Everything you need to know about campus
          </p>
        </div>

        {/* Classes Section */}
        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Classes
          </h3>
          <div className="space-y-3">
            {campusInfo.classes.map((cls, index) => (
              <Card key={index} className="p-4 bg-card border-border">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">{cls.name}</h4>
                      <p className="text-sm text-muted-foreground">{cls.code}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground">{cls.instructor}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {cls.timings}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {cls.room}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Events Section */}
        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accent" />
            Upcoming Events
          </h3>
          <div className="space-y-3">
            {campusInfo.events.map((event, index) => (
              <Card key={index} className="p-4 bg-card border-border">
                <h4 className="font-semibold text-foreground mb-2">{event.title}</h4>
                <p className="text-sm text-foreground mb-2">{event.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Facilities Section */}
        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Facilities
          </h3>
          <div className="space-y-3">
            {campusInfo.facilities.map((facility, index) => (
              <Card key={index} className="p-4 bg-card border-border">
                <h4 className="font-semibold text-foreground mb-2">{facility.name}</h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {facility.timings}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {facility.location}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default InfoPage;
