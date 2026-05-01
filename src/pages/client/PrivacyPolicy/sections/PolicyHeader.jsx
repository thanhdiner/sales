import { PageHero } from '@/components/client/PageLayout'

const PolicyHeader = ({ content = {} }) => {
  return (
    <PageHero
      eyebrow={content.eyebrow}
      title={content.title}
      description={content.description}
      badges={[content.updatedAt, content.gdpr, content.iso]}
    />
  )
}

export default PolicyHeader
