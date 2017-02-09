# frozen_string_literal: true

# notification codes to differentiate different types of notifications
# e.g. a notification might have {
#   notified_object_type: 'Map',
#   notified_object_id: 1,
#   notification_code: MAILBOXER_CODE_ACCESS_REQUEST
# },
# which would imply that this is an access request to Map.find(1)
MAILBOXER_CODE_MESSAGE_FROM_DEVS = 'MESSAGE_FROM_DEVS'

# these ones are old and can't change without a migration
MAILBOXER_CODE_ACCESS_APPROVED          = 'ACCESS_APPROVED'
MAILBOXER_CODE_ACCESS_REQUEST           = 'ACCESS_REQUEST'
MAILBOXER_CODE_INVITE_TO_EDIT           = 'INVITE_TO_EDIT'

# these ones are new
# this one's a catch all for edits ON the map
MAILBOXER_CODE_MAP_ACTIVITY             = 'MAP_ACTIVITY'
# MAILBOXER_CODE_MAP_ADDED_TO_MAP       = 'MAP_ADDED_TO_MAP'
MAILBOXER_CODE_MAP_COLLABORATOR_ADDED   = 'MAP_COLLABORATOR_ADDED'
# BOTHER WITH MAP_COLLABORATOR_REMOVED ?
MAILBOXER_CODE_MAP_UPDATED               = 'MAP_UPDATED' # this refers to the map object itself: name, desc, permission, etc
# ADD MAP_FORKED
MAILBOXER_CODE_MAP_MESSAGE              = 'MAP_MESSAGE'
MAILBOXER_CODE_MAP_STARRED              = 'MAP_STARRED'

MAILBOXER_CODE_TOPIC_ADDED_TO_MAP       = 'TOPIC_ADDED_TO_MAP'
MAILBOXER_CODE_TOPIC_CONNECTED          = 'TOPIC_CONNECTED'
MAILBOXER_CODE_TOPIC_DELETED            = 'TOPIC_DELETED'
MAILBOXER_CODE_TOPIC_DISCONNECTED       = 'TOPIC_DISCONNECTED'
MAILBOXER_CODE_TOPIC_UPDATED            = 'TOPIC_UPDATED'
# BOTHER WITH TOPIC_REMOVED_FROM_MAP ?

Mailboxer.setup do |config|
  # Configures if your application uses or not email sending for Notifications and Messages
  config.uses_emails = true

  # Configures the default from for emails sent for Messages and Notifications
  config.default_from = 'team@metamaps.cc'

  # Configures the methods needed by mailboxer
  config.email_method = :mailboxer_email
  config.name_method = :name

  # Configures if you use or not a search engine and which one you are using
  # Supported engines: [:solr,:sphinx]
  config.search_enabled = false
  config.search_engine = :solr

  # Configures maximum length of the message subject and body
  config.subject_max_length = 255
  config.body_max_length = 32_000
end
