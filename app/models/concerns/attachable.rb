# frozen_string_literal: true
module Attachable
  extend ActiveSupport::Concern

  included do
    has_many :attachments, as: :attachable, dependent: :destroy
  end

  def images
    attachments.where(file_content_type: self.image_types)
  end

  def audios
    attachments.where(file_content_type: self.audio_types)
  end

  def texts
    attachments.where(file_content_type: self.text_types)
  end

  def pdfs
    attachments.where(file_content_type: self.pdf_types)
  end

  def documents
    attachments.where(file_content_type: self.text_types + self.pdf_types)
  end

  class << self
    def image_types
      ['image/png', 'image/gif', 'image/jpeg']
    end

    def audio_types
      ['audio/ogg', 'audio/mp3']
    end

    def text_types
      ['text/plain', 'text/markdown']
    end

    def pdf_types
      ['application/pdf']
    end

    def allowed_types
      image_types + audio_types + text_types + pdf_types
    end
  end
end
