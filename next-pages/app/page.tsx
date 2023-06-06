'use client';
import { useState } from 'react';
import range from 'lodash/range';
import AppLayout from '@/cloudscape-components/app-layout';
import BreadcrumbGroup from '@/cloudscape-components/breadcrumb-group';
import ContentLayout from '@/cloudscape-components/content-layout';
import SpaceBetween from '@/cloudscape-components/space-between';
import Header from '@/cloudscape-components/header';
import Link from '@/cloudscape-components/link';
import Button from '@/cloudscape-components/button';
import Alert from '@/cloudscape-components/alert';
import Container from '@/cloudscape-components/container';

function Containers() {
  const [count, setCount] = useState(2);
  return (
    <SpaceBetween size="l">
      {range(count).map(i => (
        <Container
          key={i}
          header={
            <Header variant="h2" actions={<Button onClick={() => setCount(count - 1)}>Remove</Button>}>
              Demo container #{i + 1}
            </Header>
          }
        >
          <div>Content placeholder</div>
        </Container>
      ))}
      <Button onClick={() => setCount(count + 1)}>Add container</Button>
    </SpaceBetween>
  );
}

export default function Home() {
  const [alertVisible, setVisible] = useState(true);

  return (
    <main>
      <AppLayout
        contentType="form"
        ariaLabels={{}}
        breadcrumbs={
          <BreadcrumbGroup
            items={[
              { text: 'Home', href: '#' },
              { text: 'Service', href: '#' },
            ]}
          />
        }
        content={
          <ContentLayout
            header={
              <SpaceBetween size="m">
                <Header
                  variant="h1"
                  info={<Link>Info</Link>}
                  description="When you create a new distribution."
                  actions={<Button variant="primary">Create distribution</Button>}
                >
                  Create distribution
                </Header>
                {alertVisible && (
                  <Alert
                    statusIconAriaLabel="Info"
                    dismissible={true}
                    dismissAriaLabel="Close alert"
                    onDismiss={() => setVisible(false)}
                    action={<Button>Do something</Button>}
                  >
                    Demo alert
                  </Alert>
                )}
              </SpaceBetween>
            }
          >
            <Containers />
          </ContentLayout>
        }
      />
    </main>
  );
}
