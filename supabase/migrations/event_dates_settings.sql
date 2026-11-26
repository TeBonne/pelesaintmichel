-- Add event date fields to site_settings
alter table site_settings add column event_dates_label text default 'De Saint-Malo au Mont, 8–10 mai';
alter table site_settings add column event_start_date date default '2026-05-08';
alter table site_settings add column event_end_date date default '2026-05-10';
