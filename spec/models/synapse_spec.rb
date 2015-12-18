require 'rails_helper'

RSpec.describe Synapse, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
  pending "validate that desc can't be nil - important for javascript"
  it { is_expected.to belong_to :user }
  it { is_expected.to belong_to :topic1 }
  it { is_expected.to belong_to :topic2 }
  it { is_expected.to have_many :maps }
  it { is_expected.to have_many :mappings }

  context 'permissions' do
    let(:owner) { create :user }
    let(:other_user) { create :user }
    let(:synapse) { create :synapse, user: owner, permission: :commons }
    let(:private_synapse) { create :synapse, user: owner, permission: :private }
    let(:public_synapse) { create :synapse, user: owner, permission: :public }

    it 'prevents deletion by non-owner' do
      expect(synapse.authorize_to_delete(other_user)).to eq false
      expect(synapse.authorize_to_delete(owner)).to eq synapse
    end

    it 'prevents visibility if private' do
      expect(synapse.authorize_to_show(other_user)).to eq true
      expect(synapse.authorize_to_show(owner)).to eq true
      expect(private_synapse.authorize_to_show(owner)).to eq true
      expect(private_synapse.authorize_to_show(other_user)).to eq false
    end

    it 'only allows editing if commons or owned' do
      expect(synapse.authorize_to_edit(other_user)).to eq true
      expect(synapse.authorize_to_edit(owner)).to eq true
      expect(private_synapse.authorize_to_edit(other_user)).to eq false
      expect(private_synapse.authorize_to_edit(owner)).to eq true
      expect(public_synapse.authorize_to_edit(other_user)).to eq false
      expect(public_synapse.authorize_to_edit(owner)).to eq true
    end
  end
end
