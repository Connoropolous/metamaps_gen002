namespace :metamaps do
  desc "delivers recent map activity digest emails to users"
  task deliver_map_activity_emails: :environment do
    summarize_map_activity
  end

  def summarize_map_activity
    Map.all.find_each do |map|
      map.followers.each do |user|
        # add logging and rescue-ing
        # and a notification of failure
        next unless MapPolicy.new(user, map).show? # just in case the permission changed
        next unless user.emails_allowed
        summary_data = MapActivityService.summarize_data(map, user)
        next if summary_data[:stats].blank?
        MapActivityMailer.daily_summary(user, summary_data).deliver_later
      end
    end
  end
end
