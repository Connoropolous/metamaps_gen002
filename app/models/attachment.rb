# frozen_string_literal: true
class Attachment < ApplicationRecord
  belongs_to :attachable, polymorphic: true

  has_attached_file :file,
                    styles: lambda { |a|
                      if a.instance.image?
                        {
                          small: 'x200>',
                          medium: 'x300>',
                          large: 'x400>'
                        }
                      else
                        {}
                      end
                    }

  validates_attachment_content_type :file, content_type: [
    %r{\Aimage/.*\Z},
    %r{\Avideo/.*\Z}
  ]

  def image?
    file.instance.file_content_type =~ /image/
  end
end
