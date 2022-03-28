import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import formatDate from '@/lib/utils/formatDate'
import { getLatestVideos } from '@/lib/youtube'
import Card from '@/components/Card'
import { getLatestJobs } from '@/lib/jobs'
import Image from '@/components/Image'
import JobGrid from '@/components/JobGrid'
import VideoCarousel from '@/components/VideoCarousel'
import Hero from '@/components/Hero'
import { getAuthors } from '@/lib/authors'

const MAX_BLOG_POSTS = 4

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog')
  const { videos } = await getLatestVideos(6)
  const { jobs } = await getLatestJobs(9)
  const authors = await getAuthors(posts)

  return { props: { posts, videos, jobs, authors } }
}

export default function Home({ posts, videos, jobs, authors }) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div className="bg-io_blue-500 text-white">
        <div className="container mx-auto pt-6 pb-8">
          <h1 className="py-12 text-center text-3xl leading-9 tracking-tight sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 xl:p-32">
            <span>
              We have <i>infinite </i>insights to share
            </span>
          </h1>
        </div>
        {posts.slice(0, 1).map((frontMatter) => {
          const { slug, date, title, image } = frontMatter
          const authorsArray = frontMatter.authors.map((author) => authors[author])

          return (
            <Hero
              key={title}
              src={`/blog/${slug}`}
              authors={authorsArray}
              date={date}
              title={title}
              image={image}
            ></Hero>
          )
        })}
        <section className="container mx-auto grid gap-4 lg:grid-cols-3">
          {!posts.length && 'No posts found.'}
          {posts.slice(1, MAX_BLOG_POSTS).map((frontMatter) => {
            const { slug, date, title, summary, tags, image } = frontMatter
            return (
              <article key={slug} className="py-12">
                <div className="space-y-2">
                  <dl>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-base font-medium leading-6">
                      <time dateTime={date}>{formatDate(date)}</time>
                    </dd>
                  </dl>
                  <div>
                    {image && (
                      <Image
                        src={image}
                        alt={title}
                        width={1200}
                        height={627}
                        layout="responsive"
                        priority={true}
                        className={
                          Math.floor(Math.random() * 2) === 1
                            ? 'rounded-bl-full'
                            : Math.floor(Math.random() * 2) === 1
                            ? 'rounded-br-full'
                            : ''
                        }
                      />
                    )}
                  </div>
                  <div className="space-y-5 xl:col-span-3">
                    <div className="space-y-6">
                      <div className="flex justify-between">
                        <div>
                          <h2 className="text-2xl font-bold leading-8 tracking-tight">
                            <Link href={`/blog/${slug}`} className="">
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                        </div>
                        <div>
                          {frontMatter.authors.map((author) => {
                            return (
                              <Image
                                key={authors[author].name}
                                src={authors[author].avatar}
                                width="50px"
                                height="50px"
                                alt="avatar"
                                className="h-10 w-10 rounded-full"
                              />
                            )
                          })}
                        </div>
                      </div>
                      <div className="prose max-w-none text-white">{summary}</div>
                    </div>
                    <div className="text-base font-medium leading-6">
                      <Link
                        href={`/blog/${slug}`}
                        className="text-white hover:text-io_orange-500"
                        aria-label={`Read "${title}"`}
                      >
                        Read more &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      </div>
      {posts.length > MAX_BLOG_POSTS && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link href="/blog" className="" aria-label="all posts">
            All Posts &rarr;
          </Link>
        </div>
      )}

      <div className="container mx-auto">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Videos
          </h1>
          <p className="text-lg leading-7 text-gray-500">{siteMetadata.description}</p>
        </div>
      </div>
      <VideoCarousel videos={videos} />

      <div className="container mx-auto md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          Jobs
        </h1>
        <JobGrid jobs={jobs} />
      </div>
    </>
  )
}
