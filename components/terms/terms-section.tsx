import {
  AlertCircle,
  Copyright,
  FileText,
  Globe2,
  Info,
  Link2,
  Mail,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

const sections = [
  {
    number: "01",
    title: "Penggunaan Website",
    icon: FileText,
    content: (
      <div className="space-y-4">
        <p>
          Website Crustea disediakan sebagai sarana informasi mengenai
          perusahaan, produk, layanan, kegiatan, dan solusi yang dikembangkan
          oleh Crustea di bidang akuakultur.
        </p>

        <p>
          Dengan mengakses dan menggunakan website ini, Anda dianggap telah
          memahami dan menyetujui Syarat & Ketentuan yang berlaku. Anda
          diharapkan menggunakan website secara wajar, bertanggung jawab, dan
          sesuai dengan hukum yang berlaku di Republik Indonesia.
        </p>
      </div>
    ),
  },
  {
    number: "02",
    title: "Informasi Website",
    icon: Info,
    content: (
      <div className="space-y-4">
        <p>
          Informasi yang tersedia di website Crustea disediakan untuk tujuan
          informasi umum. Kami berupaya menjaga agar informasi yang ditampilkan
          tetap relevan dan akurat.
        </p>

        <p>
          Namun, informasi mengenai produk, layanan, spesifikasi, fitur,
          program, kegiatan, maupun informasi perusahaan dapat berubah dari
          waktu ke waktu tanpa pemberitahuan sebelumnya.
        </p>

        <p>
          Informasi yang terdapat di website ini tidak selalu mencerminkan
          seluruh detail atau kondisi terbaru dari produk dan layanan Crustea.
          Untuk informasi lebih lanjut, Anda dapat menghubungi tim Crustea
          melalui kontak yang tersedia di website.
        </p>
      </div>
    ),
  },
  {
    number: "03",
    title: "Kekayaan Intelektual",
    icon: Copyright,
    content: (
      <div className="space-y-4">
        <p>
          Seluruh atau sebagian konten yang terdapat dalam website Crustea,
          termasuk namun tidak terbatas pada nama perusahaan, logo, merek,
          desain, teks, foto, ilustrasi, video, grafik, dan materi lainnya,
          merupakan milik Crustea atau digunakan berdasarkan hak dan izin yang
          sah.
        </p>

        <p>
          Konten tersebut tidak boleh disalin, direproduksi, dimodifikasi,
          didistribusikan, dipublikasikan, atau digunakan untuk tujuan komersial
          tanpa memperoleh izin tertulis dari pihak yang memiliki hak atas
          konten tersebut.
        </p>

        <p>
          Penggunaan konten untuk tujuan yang melanggar hukum atau merugikan
          Crustea tidak diperbolehkan.
        </p>
      </div>
    ),
  },
  {
    number: "04",
    title: "Penggunaan yang Diperbolehkan",
    icon: ShieldCheck,
    content: (
      <div className="space-y-4">
        <p>
          Pengguna dapat mengakses dan menggunakan website Crustea untuk
          memperoleh informasi mengenai perusahaan, produk, layanan, dan
          aktivitas Crustea selama penggunaan tersebut dilakukan secara sah.
        </p>

        <p>Pengguna tidak diperbolehkan untuk:</p>

        <ul className="list-disc space-y-2 pl-5">
          <li>
            menggunakan website untuk tujuan yang melanggar hukum atau peraturan
            yang berlaku;
          </li>
          <li>
            mencoba memperoleh akses tanpa izin ke sistem, server, atau bagian
            lain dari website;
          </li>
          <li>
            melakukan tindakan yang dapat mengganggu, merusak, atau membebani
            operasional website;
          </li>
          <li>
            menggunakan konten website dengan cara yang dapat menyesatkan atau
            memberikan kesan adanya hubungan, dukungan, atau persetujuan dari
            Crustea tanpa izin; atau
          </li>
          <li>
            menggunakan website untuk tujuan yang dapat merugikan Crustea atau
            pihak lain.
          </li>
        </ul>
      </div>
    ),
  },
  {
    number: "05",
    title: "Tautan Pihak Ketiga",
    icon: Link2,
    content: (
      <div className="space-y-4">
        <p>
          Website Crustea dapat menyediakan tautan menuju website, platform,
          layanan, atau media sosial milik pihak ketiga, termasuk namun tidak
          terbatas pada WhatsApp, Instagram, LinkedIn, atau layanan lainnya.
        </p>

        <p>
          Tautan tersebut disediakan untuk memudahkan pengguna memperoleh
          informasi atau berkomunikasi dengan Crustea. Crustea tidak mengontrol
          seluruh konten, kebijakan, keamanan, atau praktik dari website dan
          layanan pihak ketiga tersebut.
        </p>

        <p>
          Penggunaan layanan pihak ketiga tunduk pada syarat dan kebijakan yang
          ditetapkan oleh masing-masing penyedia layanan.
        </p>
      </div>
    ),
  },
  {
    number: "06",
    title: "Ketersediaan Website",
    icon: Globe2,
    content: (
      <div className="space-y-4">
        <p>
          Crustea berupaya menjaga agar website dapat diakses dan berfungsi
          dengan baik. Namun, kami tidak menjamin bahwa website akan selalu
          tersedia, bebas dari gangguan, atau dapat diakses tanpa adanya
          kesalahan.
        </p>

        <p>
          Website dapat mengalami gangguan sementara karena pemeliharaan,
          pembaruan sistem, masalah teknis, gangguan jaringan, atau kondisi lain
          di luar kendali Crustea.
        </p>
      </div>
    ),
  },
  {
    number: "07",
    title: "Penafian",
    icon: AlertCircle,
    content: (
      <div className="space-y-4">
        <p>
          Informasi dalam website ini disediakan dengan itikad baik sebagai
          informasi umum. Meskipun Crustea berupaya menjaga keakuratan dan
          relevansi informasi, kami tidak menjamin bahwa seluruh informasi
          selalu lengkap, akurat, atau bebas dari kesalahan pada setiap waktu.
        </p>

        <p>
          Penggunaan informasi yang tersedia di website menjadi tanggung jawab
          pengguna. Untuk kebutuhan yang memerlukan informasi teknis,
          operasional, atau penjelasan lebih lanjut, pengguna disarankan untuk
          menghubungi Crustea secara langsung.
        </p>
      </div>
    ),
  },
  {
    number: "08",
    title: "Perubahan Syarat & Ketentuan",
    icon: RefreshCw,
    content: (
      <div className="space-y-4">
        <p>
          Crustea dapat memperbarui atau mengubah Syarat & Ketentuan ini dari
          waktu ke waktu untuk menyesuaikan dengan perkembangan website,
          layanan, kegiatan perusahaan, maupun ketentuan hukum yang berlaku.
        </p>

        <p>
          Perubahan akan dipublikasikan melalui halaman ini dan berlaku sejak
          tanggal yang tercantum pada versi terbaru Syarat & Ketentuan.
        </p>

        <p>
          Dengan tetap menggunakan website setelah adanya perubahan, pengguna
          dianggap telah membaca dan memahami ketentuan yang telah diperbarui.
        </p>
      </div>
    ),
  },
  {
    number: "09",
    title: "Hubungi Kami",
    icon: Mail,
    content: (
      <div className="space-y-5">
        <p>
          Jika Anda memiliki pertanyaan mengenai Syarat & Ketentuan ini atau
          mengenai penggunaan website Crustea, Anda dapat menghubungi kami
          melalui informasi berikut:
        </p>

        <div className="rounded-2xl border border-border bg-muted/40 p-5">
          <p className="font-semibold text-foreground">
            PT Eco Karya Teknologi
          </p>

          <div className="mt-3 space-y-2 text-[14px] leading-6">
            <p>
              Ground Floor Crustea Labs,
              <br />
              Jl. Sanggung Timur No. 1,
              <br />
              Jatingaleh, Semarang,
              <br />
              Jawa Tengah 50254
            </p>

            <p>
              Email:{" "}
              <a
                href="mailto:info@crustea.id"
                className="font-medium text-brand-secondary transition-colors hover:text-brand-dark"
              >
                info@crustea.id
              </a>
            </p>

            <p>
              WhatsApp:{" "}
              <a
                href="https://wa.me/6282140773592"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-secondary transition-colors hover:text-brand-dark"
              >
                +62 821-4077-3592
              </a>
            </p>
          </div>
        </div>
      </div>
    ),
  },
];

export default function TermsSection() {
  return (
    <>
      {/* Intro */}
      <section className="relative overflow-hidden bg-background">
        <div
          className="pointer-events-none absolute -left-40 top-20 size-[360px] rounded-full bg-secondary/50 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -right-40 bottom-0 size-[360px] rounded-full bg-accent/40 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:py-16 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
              Ketentuan Penggunaan
            </p>

            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
              Ketentuan penggunaan website Crustea.
            </h2>

            <p className="mt-5 text-[15px] leading-7 text-muted-foreground">
              Syarat & Ketentuan ini menjelaskan aturan umum yang berlaku ketika
              Anda mengakses dan menggunakan website Crustea. Dengan menggunakan
              website ini, Anda diharapkan menggunakan seluruh informasi dan
              layanan yang tersedia secara bertanggung jawab.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm">
              <RefreshCw className="size-4 text-brand-secondary" />
              Terakhir diperbarui: September 2026
            </div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="relative border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
            {/* Table of Contents */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 h-fit">
                <div className="rounded-[24px] border border-border bg-background p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-secondary">
                    Daftar Isi
                  </p>

                  <nav
                    className="mt-4 space-y-1"
                    aria-label="Daftar Isi Syarat & Ketentuan"
                  >
                    {sections.map((section) => (
                      <a
                        key={section.number}
                        href={`#terms-${section.number}`}
                        className="flex items-start gap-3 rounded-lg px-3 py-2 text-sm leading-5 text-muted-foreground transition-colors hover:bg-secondary hover:text-brand-dark"
                      >
                        <span className="shrink-0 font-semibold text-brand-secondary">
                          {section.number}
                        </span>

                        <span>{section.title}</span>
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </aside>

            {/* Terms Articles */}
            <div className="min-w-0 space-y-5">
              {sections.map((section) => {
                const Icon = section.icon;

                return (
                  <article
                    key={section.number}
                    id={`terms-${section.number}`}
                    className="scroll-mt-28 rounded-[24px] border border-border bg-background p-6 shadow-sm sm:p-8"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-brand-secondary">
                        <Icon
                          className="size-5"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold tracking-[0.14em] text-brand-secondary">
                            {section.number}
                          </span>

                          <span
                            className="h-px w-6 bg-border"
                            aria-hidden="true"
                          />
                        </div>

                        <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                          {section.title}
                        </h2>
                      </div>
                    </div>

                    <div className="mt-6 pl-0 text-[14px] leading-7 text-muted-foreground sm:pl-[60px]">
                      {section.content}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
