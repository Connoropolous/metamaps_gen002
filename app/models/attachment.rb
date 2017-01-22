class Attachment < ApplicationRecord
  belongs_to :attachable, polymorphic: true

  has_attached_file :file,
    styles: lambda { |a| 
      a.instance.is_image? ? {
        small: 'x200>',
        medium: 'x300>', 
        large: 'x400>'
      } : {}
    }

  validates_attachment_content_type :file, :content_type => [
    /\Aimage\/.*\Z/,
    /\Avideo\/.*\Z/
  ]

  def is_image?
    file.instance.file_content_type =~ %r(image)
  end
end
