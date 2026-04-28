import { PageHero } from '@/components/PageLayout'

const PolicyPageHeader = ({ content = {} }) => {
  return (
    <PageHero
      eyebrow={content.eyebrow}
      title={content.title}
      description={content.description}
      badges={[content.updatedAt, content.gdpr, content.iso]}
    />
  )
}

export default PolicyPageHeader
