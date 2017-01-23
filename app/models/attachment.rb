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

  validates_attachment_content_type :file, content_type: Attachable.allowed_types

  def image?
    file.instance.file_content_type =~ %r{\Aimage}
  end

  def audio?
    file.instance.file_content_type ~= %r{\Aaudio}
  end

  def text?
    file.instance.file_content_type ~= %r{\Atext}
  end

  def pdf?
    file.instance.file_content_type == 'application/pdf'
  end

  def document?
    text? || pdf?
  end
end
